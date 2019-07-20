import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import Response from "../../../../request/response"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("berserk skill action", () => {
  it("fails often when not practiced", async () => {
    // given
    (await testRunner.createMob())
      .withSkill(SkillType.Berserk)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Berserk)

    // then
    expect(responses.filter(response => !response.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.9)
  })

  it("should be able to succeed berserking", async () => {
    // given
    const mobBuilder = (await testRunner.createMob())
      .setLevel(20)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Berserk)

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(mobBuilder.hasAffect(AffectType.Berserk)).toBeTruthy()
  })

  it("should generate accurate messages", async () => {
    // given
    const mobBuilder = (await testRunner.createMob())
      .setLevel(40)
      .withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses: Response[] = await testRunner.invokeSkillNTimes(iterations, SkillType.Berserk)

    // then
    const successResponse = responses.find(response => response.isSuccessful()) as Response
    expect(successResponse.getMessageToRequestCreator())
      .toBe("your pulse speeds up as you are consumed by rage!")
    expect(successResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name}'s pulse speeds up as they are consumed by rage!`)

    // and
    const failResponse = responses.find(response => !response.isSuccessful()) as Response
    expect(failResponse.getMessageToRequestCreator())
      .toBe("You fail to summon your inner rage.")
    expect(failResponse.getMessageToTarget())
      .toBe("")
    expect(failResponse.getMessageToObservers())
      .toBe("")
  })
})
