import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import doNTimes from "../../functional/times"
import enhancedDamage from "./enhancedDamage"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { Trigger } from "../../mob/trigger"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import Outcome from "../outcome"

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    const testBuilder = new TestBuilder()
    const skill = testBuilder.withPlayer().withSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)
    const player = testBuilder.player
    const mob = player.sessionMob
    const iterationCount = 100

    const outcomes = await doNTimes(iterationCount, () =>
      enhancedDamage(new Attempt(mob, skill, new AttemptContext(Trigger.None, mob))))
    expect(outcomes.filter((outcome: Outcome) =>
      outcome.wasSuccessful()).length).toBeGreaterThan(iterationCount / 2)
  })
})
