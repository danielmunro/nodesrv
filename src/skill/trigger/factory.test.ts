import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Trigger } from "../../mob/enum/trigger"
import { addFight, Fight, reset } from "../../mob/fight/fight"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import { createSkillTriggerEvent } from "./factory"
import { Resolution } from "./resolution"

describe("skill trigger factory", () => {
  beforeEach(() => reset())

  it("should handle no skills", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()

    // when
    const triggerFail = await createSkillTriggerEvent(mob, Trigger.AttackRoundDefend, target, getTestRoom())

    // then
    expect(triggerFail.skillEventResolution).toBe(Resolution.Failed)
  })

  it("should invoke a skill if it matches the event trigger", async () => {
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob()
    const target = testBuilder.withMob()
    mob.withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL)
    addFight(new Fight(mob.mob, target.mob, testBuilder.room))

    // when
    const triggerSuccess = await createSkillTriggerEvent(mob.mob, Trigger.AttackRoundDefend, target.mob, getTestRoom())

    // then
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Invoked)
  })

  it("should be ok if the skill type was not found", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()
    mob.skills.push(newSkill(SkillType.Noop, MAX_PRACTICE_LEVEL))

    // when
    const triggerSuccess = await createSkillTriggerEvent(mob, Trigger.AttackRoundDefend, target, getTestRoom())

    // then
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Failed)
  })
})
