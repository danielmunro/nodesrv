import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import PlayerBuilder from "../../../../test/playerBuilder"
import TestBuilder from "../../../../test/testBuilder"

const iterations = 10
let testBuilder: TestBuilder
let player: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
})

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    // given
    player.addSkill(SkillType.Sneak)

    // when
    const responses = await doNTimes(iterations,
      async () => testBuilder.handleAction(RequestType.Sneak))

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    // given
    player.setLevel(40)
      .addSkill(SkillType.Sneak, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations,
      async () => testBuilder.handleAction(RequestType.Sneak))

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
  })
})
