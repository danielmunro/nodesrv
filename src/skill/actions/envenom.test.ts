import doNTimes from "../../functional/times"
import { Trigger } from "../../mob/trigger"
import TestBuilder from "../../test/testBuilder"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import Outcome from "../outcome"
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

  it("should success sometimes", async () => {
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
})
