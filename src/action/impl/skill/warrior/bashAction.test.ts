import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import Response from "../../../../request/response"
import {SkillType} from "../../../../skill/skillType"
import doNTimes, {doNTimesOrUntilTruthy, getSuccessfulAction} from "../../../../support/functional/times"
import PlayerBuilder from "../../../../test/playerBuilder"
import TestBuilder from "../../../../test/testBuilder"
import Action from "../../../action"

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
    const response = await doNTimesOrUntilTruthy(
      iterations,
      async () => {
        const handled = await action.handle(testBuilder.createRequest(RequestType.Bash))
        return handled.isFailure() ? handled : undefined
      }) as Response

    // then
    expect(response).toBeDefined()
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    const opponent = testBuilder.withMob()
    await testBuilder.fight(opponent.mob)

    // when
    await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Bash))

    // then
    expect(opponent.mob.getAffect(AffectType.Stunned)).toBeDefined()
  })

  it("should generate messages correctly", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL / 2)
    const opponent = testBuilder.withMob()
    await testBuilder.fight(opponent.mob)

    // when
    const responses: Response[] = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    const successResponse = responses.find(response => response.isSuccessful()) as Response
    expect(successResponse.message.getMessageToRequestCreator())
      .toBe(`you slam into ${opponent.getMobName()} and send them flying!`)
    expect(successResponse.message.getMessageToTarget())
      .toBe(`${player.getMob().name} slams into you and sends you flying!`)
    expect(successResponse.message.getMessageToObservers())
      .toBe(`${player.getMob().name} slams into ${opponent.getMobName()} and sends them flying!`)

    // and
    const failResponse = responses.find(response => !response.isSuccessful()) as Response
    expect(failResponse.message.getMessageToRequestCreator())
      .toBe("you fall flat on your face!")
    expect(failResponse.message.getMessageToTarget())
      .toBe(`${player.getMob().name} falls flat on their face!`)
    expect(failResponse.message.getMessageToObservers())
      .toBe(`${player.getMob().name} falls flat on their face!`)
  })
})
