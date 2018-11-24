import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 1000
let testBuilder: TestBuilder
let definition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  definition = await testBuilder.getSkillDefinition(SkillType.EnhancedDamage)
})

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.doAction(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 2)
  })

  it("should succeed somewhat when practiced some", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL / 2)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.doAction(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThan(iterations / 2)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.doAction(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThan(iterations / 10)
  })
})
