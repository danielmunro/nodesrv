import doNTimes from "../../functional/times"
import { Trigger } from "../../mob/trigger"
import TestBuilder from "../../test/testBuilder"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { Messages } from "../constants"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { SkillType } from "../skillType"
import envenom from "./envenom"

function getTestBuilder() {
  const testBuilder = new TestBuilder()
  testBuilder.withPlayer().withSkill(SkillType.Envenom)
  testBuilder.addWeaponToPlayerInventory()

  return testBuilder
}

describe("envenom", () => {
  it("should fail at low levels", async () => {
    // setup
    const testBuilder = getTestBuilder()
    const mob = testBuilder.player.sessionMob
    const skill = mob.skills[0]
    const weapon = mob.inventory.items[0]

    // when
    const outcomes = await doNTimes(10, () =>
      envenom(new Attempt(mob, skill, new AttemptContext(Trigger.None, weapon)))) as Outcome[]

    // then
    expect(outcomes.find((outcome) => outcome.wasSuccessful())).toBeUndefined()
  })

  it("should succeed sometimes", async () => {
    // setup
    const testBuilder = getTestBuilder()
    const mob = testBuilder.player.sessionMob
    const skill = mob.skills[0]
    const weapon = mob.inventory.items[0]
    skill.level = 100
    weapon.level = 50

    // when
    const outcomes = await doNTimes(10, () =>
      envenom(new Attempt(mob, skill, new AttemptContext(Trigger.None, weapon)))) as Outcome[]

    // then
    expect(outcomes.find((outcome) => outcome.wasSuccessful())).toBeDefined()
  })

  it("should not be able to envenom a non weapon", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const skill = playerBuilder.withSkill(SkillType.Envenom, 100)
    const eq = playerBuilder.withHelmetEq()

    const response = await envenom(
      new Attempt(playerBuilder.player.sessionMob, skill, new AttemptContext(Trigger.None, eq)))

    expect(response.wasSuccessful()).toBeFalsy()
    expect(response.outcomeType).toBe(OutcomeType.CheckFail)
    expect(response.getMessage()).toBe(Messages.Envenom.Fail.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Envenom, 100)
    const mob = playerBuilder.player.sessionMob
    const skill = mob.skills[0]
    const mace = playerBuilder.withMaceEq()

    const response = await envenom(new Attempt(mob, skill, new AttemptContext(Trigger.None, mace)))

    expect(response.wasSuccessful()).toBeFalsy()
    expect(response.outcomeType).toBe(OutcomeType.CheckFail)
    expect(response.getMessage()).toBe(Messages.Envenom.Fail.WrongWeaponType)
  })
})
