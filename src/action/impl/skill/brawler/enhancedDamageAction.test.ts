import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100
let testRunner: TestRunner
let player: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = testRunner.createPlayer()
    .setLevel(40)
})

describe("enhanced damage skill action", () => {
  it("succeeds sometimes when practiced", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.EnhancedDamage)

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.1)
  })

  it("succeeds somewhat when practiced partially", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.EnhancedDamage)

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.05)
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.8)
  })

  it("succeeds infrequently when not practiced", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.EnhancedDamage)

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.2)
  })
})
