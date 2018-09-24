import doNTimes from "../../functional/times"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../constants"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"
import envenom from "./envenom"

async function getTestBuilder() {
  const testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  playerBuilder.withSkill(SkillType.Envenom)
  testBuilder.addWeaponToPlayerInventory()

  return testBuilder
}

describe("envenom", () => {
  it("should fail at low levels", async () => {
    // setup
    const testBuilder = await getTestBuilder()
    const mob = testBuilder.player.sessionMob
    const weapon = mob.inventory.items[0]

    // when
    const outcomes = await doNTimes(10, () =>
      envenom(mob.attempt(SkillType.Envenom, weapon))) as Outcome[]

    // then
    expect(outcomes.find((outcome) => outcome.wasSuccessful())).toBeUndefined()
  })

  it("should succeed sometimes", async () => {
    // setup
    const testBuilder = await getTestBuilder()
    const mob = testBuilder.player.sessionMob
    const skill = mob.skills[0]
    const weapon = mob.inventory.items[0]
    skill.level = 100
    weapon.level = 50

    // when
    const outcomes = await doNTimes(10, () =>
      envenom(mob.attempt(SkillType.Envenom, weapon))) as Outcome[]

    // then
    expect(outcomes.find((outcome) => outcome.wasSuccessful())).toBeDefined()
  })

  it("should not be able to envenom a non weapon", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Envenom, 100)
    const mob = playerBuilder.player.sessionMob

    // given
    const eq = playerBuilder.withHelmetEq()

    // when
    const response = await envenom(mob.attempt(SkillType.Envenom, eq))

    // then
    expect(response.wasSuccessful()).toBeFalsy()
    expect(response.outcomeType).toBe(OutcomeType.CheckFail)
    expect(response.getMessage()).toBe(Messages.Envenom.Fail.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Envenom, 100)
    const mob = playerBuilder.player.sessionMob

    // given
    const mace = playerBuilder.withMaceEq()

    // when
    const response = await envenom(mob.attempt(SkillType.Envenom, mace))

    // then
    expect(response.wasSuccessful()).toBeFalsy()
    expect(response.outcomeType).toBe(OutcomeType.CheckFail)
    expect(response.getMessage()).toBe(Messages.Envenom.Fail.WrongWeaponType)
  })
})
