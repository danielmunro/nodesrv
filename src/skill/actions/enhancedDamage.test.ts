import { newAttributesWithStats, newStats } from "../../attributes/factory"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Race } from "../../mob/race/race"
import TestBuilder from "../../test/testBuilder"
import Attempt from "../attempt"
import { SkillType } from "../skillType"
import enhancedDamage from "./enhancedDamage"

function getMob() {
  const testBuilder = new TestBuilder()
  testBuilder.withPlayer().withSkill(SkillType.EnhancedDamage)
  const player = testBuilder.player
  const mob = player.sessionMob
  mob.race = Race.Giant

  return mob
}

async function doEnhancedDamage(iterationCount: number, attempt: Attempt) {
  return (await doNTimes(iterationCount, () => enhancedDamage(attempt)))
           .filter((outcome) => outcome.wasSuccessful())
}

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    // setup
    const mob = getMob()
    mob.attributes.push(newAttributesWithStats(newStats(4, 0, 0, 0, 0, 4)))
    const skill = mob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL
    const iterationCount = 1000

    // when
    const outcomes = await doEnhancedDamage(iterationCount, mob.attempt(SkillType.EnhancedDamage))

    // then
    expect(outcomes.length).toBeGreaterThan(iterationCount / 2)
  })

  it("should succeed somewhat when practiced some", async () => {
    // setup
    const mob = getMob()
    const skill = mob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL / 2
    const iterationCount = 1000

    // when
    const outcomes = await doEnhancedDamage(iterationCount, mob.attempt(SkillType.EnhancedDamage))

    // then
    expect(outcomes.length).toBeLessThan(iterationCount / 2)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    const mob = getMob()
    const iterationCount = 1000

    // when
    const outcomes = await doEnhancedDamage(iterationCount, mob.attempt(SkillType.EnhancedDamage))

    // then
    expect(outcomes.length).toBeLessThan(iterationCount / 10)
  })
})
