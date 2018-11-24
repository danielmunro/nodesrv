import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Trigger } from "../../mob/enum/trigger"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { createSkillTriggerEvent } from "./factory"
import { Resolution } from "./resolution"

describe("skill trigger factory", () => {
  it("should handle no skills", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob().mob

    // when
    const triggerFail = await createSkillTriggerEvent(
      await testBuilder.getService(), mob, Trigger.AttackRoundDefend, testBuilder.withMob().mob, getTestRoom())

    // then
    expect(triggerFail.skillEventResolution).toBe(Resolution.Failed)
  })

  it("should invoke a skill if it matches the event trigger", async () => {
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob()
    const target = testBuilder.withMob()
    mob.withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL)
    await testBuilder.fight(target.mob)

    // when
    const triggerSuccess = await createSkillTriggerEvent(
      await testBuilder.getService(), mob.mob, Trigger.AttackRoundDefend, target.mob, getTestRoom())

    // then
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Invoked)
  })

  it("should be ok if the skill type was not found", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob()
    const target = testBuilder.withMob()
    mob.withSkill(SkillType.Noop, MAX_PRACTICE_LEVEL)

    // when
    const triggerSuccess = await createSkillTriggerEvent(
      await testBuilder.getService(), mob.mob, Trigger.AttackRoundDefend, target.mob, getTestRoom())

    // then
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Failed)
  })
})
