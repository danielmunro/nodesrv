import { Trigger } from "../../mob/trigger"
import { getTestMob } from "../../test/mob"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import { createSkillTriggerEvent } from "./factory"
import { Resolution } from "./resolution"

describe("skill trigger factory", () => {
  it("should handle no skills", async () => {
    const mob = getTestMob()
    const target = getTestMob()
    const triggerFail = await createSkillTriggerEvent(mob, Trigger.AttackRoundStart, target)

    expect(triggerFail.skillEventResolution).toBe(Resolution.Failed)
  })

  it("should invoke a skill if it matches the event trigger", async () => {
    const mob = getTestMob()
    const target = getTestMob()
    mob.skills.push(newSkill(SkillType.Dodge, 100))

    const triggerSuccess = await createSkillTriggerEvent(mob, Trigger.AttackRoundStart, target)
    expect(triggerSuccess.skillEventResolution).toBe(Resolution.Invoked)
  })
})
