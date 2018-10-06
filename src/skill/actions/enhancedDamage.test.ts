import { newAttributesWithStats, newStats } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Race } from "../../mob/race/race"
import { Trigger } from "../../mob/trigger"
import EventContext from "../../request/context/eventContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import enhancedDamagePrecondition from "../preconditions/enhancedDamage"
import { SkillType } from "../skillType"
import enhancedDamage from "./enhancedDamage"

async function getMob() {
  const testBuilder = new TestBuilder()
  const playerBuilder = await testBuilder.withPlayer()
  playerBuilder.withSkill(SkillType.EnhancedDamage)
  const player = testBuilder.player
  const mob = player.sessionMob
  mob.race = Race.Giant

  return mob
}

async function doEnhancedDamage(iterationCount: number, checkedRequest: CheckedRequest) {
  return (await doNTimes(iterationCount, () => enhancedDamage(checkedRequest)))
           .filter((outcome) => outcome.isSuccessful())
}

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    // setup
    const mob = await getMob()
    mob.attributes.push(newAttributesWithStats(newStats(4, 0, 0, 0, 0, 4)))
    const skill = mob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL
    const iterationCount = 1000
    const request = new Request(mob, new EventContext(RequestType.Event, Trigger.DamageModifier))

    // when
    const outcomes = await doEnhancedDamage(
      iterationCount,
      new CheckedRequest(request, await enhancedDamagePrecondition(request)))

    // then
    expect(outcomes.length).toBeGreaterThan(iterationCount / 2)
  })

  it("should succeed somewhat when practiced some", async () => {
    // setup
    const mob = await getMob()
    const skill = mob.skills[0]
    skill.level = MAX_PRACTICE_LEVEL / 2
    const iterationCount = 1000
    const request = new Request(mob, new EventContext(RequestType.Event, Trigger.DamageModifier))

    // when
    const outcomes = await doEnhancedDamage(
      iterationCount,
      new CheckedRequest(request, await enhancedDamagePrecondition(request)))

    // then
    expect(outcomes.length).toBeLessThan(iterationCount / 2)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    const mob = await getMob()
    const iterationCount = 1000
    const request = new Request(mob, new EventContext(RequestType.Event, Trigger.DamageModifier))

    // when
    const outcomes = await doEnhancedDamage(
      iterationCount,
      new CheckedRequest(request, await enhancedDamagePrecondition(request)))

    // then
    expect(outcomes.length).toBeLessThan(iterationCount / 10)
  })
})
