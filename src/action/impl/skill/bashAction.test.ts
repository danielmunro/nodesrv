import { AffectType } from "../../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import Response from "../../../request/response"
import { Messages } from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import { all } from "../../../support/functional/collection"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 100
let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Bash)
})

describe("bash", () => {
  it("should be able to trigger a failed bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, () => action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
    expect(all(responses, r => r.result === Messages.Bash.Fail))
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    player.sessionMob.level = 20
    const fight = await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, () => action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(fight.getOpponentFor(player.sessionMob).getAffect(AffectType.Stunned)).toBeDefined()
  })

  it("should generate messages correctly", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.Bash, MAX_PRACTICE_LEVEL / 2)
    player.sessionMob.level = 20
    const fight = await testBuilder.fight()
    const opponent = fight.getOpponentFor(player.sessionMob)

    // when
    const responses: Response[] = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Bash)))

    // then
    const successResponse = responses.find(response => response.isSuccessful())
    expect(successResponse.message.getMessageToRequestCreator())
      .toBe(`you slam into ${opponent.name} and send them flying!`)
    expect(successResponse.message.getMessageToTarget())
      .toBe(`${player.sessionMob.name} slams into you and sends you flying!`)
    expect(successResponse.message.getMessageToObservers())
      .toBe(`${player.sessionMob.name} slams into ${opponent.name} and sends them flying!`)

    // and
    const failResponse = responses.find(response => !response.isSuccessful())
    expect(failResponse.message.getMessageToRequestCreator())
      .toBe("you fall flat on your face!")
    expect(failResponse.message.getMessageToTarget())
      .toBe(`${player.sessionMob.name} falls flat on their face!`)
    expect(failResponse.message.getMessageToObservers())
      .toBe(`${player.sessionMob.name} falls flat on their face!`)
  })
})
