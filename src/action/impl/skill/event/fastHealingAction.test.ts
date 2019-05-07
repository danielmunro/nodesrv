import {createTestAppContainer} from "../../../../app/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { SkillType } from "../../../../skill/skillType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("fast healing skill action", () => {
  it("should succeed and fail periodically", async () => {
    // setup
    const mobBuilder = testRunner.createMob()

    // given
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.FastHealing)

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(responses.some(response => response.isFailure())).toBeTruthy()
  })
})
