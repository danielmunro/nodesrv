import { Trigger } from "../../mob/trigger"
import { getTestMob } from "../../test/mob"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import { createSkillTriggerEvent } from "./factory"
import { Resolution } from "./resolution"
import { MaxPracticeLevel } from "../../mob/model/mob"

describe("skill trigger factory", () => {
  it("should handle no skills", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()

    // when
    const triggerFail = await createSkillTriggerEvent(mob, Trigger.AttackRoundStart, target)

    // then
    expect(triggerFail.skillEventResolution).toBe(Resolution.Failed)
  })

  it("should invoke a skill if it matches the event trigger", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()
    mob.skills.push(newSkill(SkillType.Dodge, MaxPracticeLevel))

    // when
    const triggerSuccess = await createSkillTriggerEvent(mob, Trigger.AttackRoundStart, target)

    // then
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Invoked)
  })
})
