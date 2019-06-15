import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../skill/skillType"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 10
let testRunner: TestRunner
let player: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = testRunner.createPlayer()
})

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    // given
    player.addSkill(SkillType.Sneak)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Sneak)

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    // given
    player.setLevel(40)
      .addSkill(SkillType.Sneak, MAX_PRACTICE_LEVEL)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Sneak)

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
  })
})
