import Skill from "../../../../action/skill"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { RequestType } from "../../../../request/requestType"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

const iterations = 10
let testBuilder: TestBuilder
let definition: Skill

beforeEach(async () => {
  testBuilder = new TestBuilder()
  definition = await testBuilder.getSkillDefinition(SkillType.EnhancedDamage) as Skill
})

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.4)
  })

  it("should succeed somewhat when practiced some", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL / 2)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.1)
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.6)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage)
    player.sessionMob.level = 40
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.2)
  })
})
