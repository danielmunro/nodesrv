import {AffectType} from "../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {SkillMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {all} from "../../../support/functional/collection"
import doNTimes, {getSuccessfulAction} from "../../../support/functional/times"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 100
let testBuilder: TestBuilder
let action: Action
let player: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Bash)
  player = await testBuilder.withPlayer()
  player.setLevel(20)
})

describe("bash skill action", () => {
  it("should be able to trigger a failed bash", async () => {
    // given
    player.addSkill(SkillType.Bash)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, () => action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
    expect(all(responses, r => r.result === SkillMessages.Bash.Fail))
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    const fight = await testBuilder.fight()

    // when
    await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Bash))

    // then
    expect(fight.getOpponentFor(player.getMob()).getAffect(AffectType.Stunned)).toBeDefined()
  })

  it("should generate messages correctly", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL / 2)
    const fight = await testBuilder.fight()
    const opponent = fight.getOpponentFor(player.getMob())

    // when
    const responses: Response[] = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    const successResponse = responses.find(response => response.isSuccessful())
    expect(successResponse.message.getMessageToRequestCreator())
      .toBe(`you slam into ${opponent.name} and send them flying!`)
    expect(successResponse.message.getMessageToTarget())
      .toBe(`${player.getMob().name} slams into you and sends you flying!`)
    expect(successResponse.message.getMessageToObservers())
      .toBe(`${player.getMob().name} slams into ${opponent.name} and sends them flying!`)

    // and
    const failResponse = responses.find(response => !response.isSuccessful())
    expect(failResponse.message.getMessageToRequestCreator())
      .toBe("you fall flat on your face!")
    expect(failResponse.message.getMessageToTarget())
      .toBe(`${player.getMob().name} falls flat on their face!`)
    expect(failResponse.message.getMessageToObservers())
      .toBe(`${player.getMob().name} falls flat on their face!`)
  })
})
