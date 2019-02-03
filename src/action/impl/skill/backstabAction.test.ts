import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {ActionMessages} from "../../../skill/constants"
import {ConditionMessages as AllMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import {all} from "../../../support/functional/collection"
import doNTimes from "../../../support/functional/times"
import {format} from "../../../support/string"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 1000
let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let opponent: Mob
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
  const fight = await testBuilder.fight()
  opponent = fight.getOpponentFor(mobBuilder.mob)
  action = await testBuilder.getActionDefinition(RequestType.Backstab)
})

describe("backstab skill action", () => {
  it("requires having the skill", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Backstab))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(AllMessages.All.NoSkill)
  })

  it("fails when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.Backstab)
    mobBuilder.mob.level = 20

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(responses.filter(r => r.isFailure()).length).toBeGreaterThan(iterations * 0.5)
    expect(all(responses, r => r.message.toRequestCreator === format(ActionMessages.Backstab.Failure, opponent)))
  })

  it("succeeds sometimes when partially practiced", async () => {
    // given
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 3)
  })

  it("succeeds sometimes when fully practiced", async () => {
    // given
    mobBuilder.mob.level = 50
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.90)
  })

  it("generates the right messages", async () => {
    // given
    mobBuilder.mob.level = 50
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Backstab)))

    // then -- success
    const successfulResponse: Response = responses.find(r => r.isSuccessful())
    expect(successfulResponse.message.getMessageToRequestCreator())
      .toBe(`you backstab ${opponent.name}!`)
    expect(successfulResponse.message.getMessageToTarget())
      .toBe(`${mobBuilder.mob.name} backstabs you!`)
    expect(successfulResponse.message.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} backstabs ${opponent.name}!`)

    // and -- failure
    const unsuccessfulResponse: Response = responses.find(r => r.isFailure())
    expect(unsuccessfulResponse.message.getMessageToRequestCreator())
      .toBe(`${opponent.name} dodges your backstab!`)
    expect(unsuccessfulResponse.message.getMessageToTarget())
      .toBe(`you dodge ${mobBuilder.mob.name}'s backstab!`)
    expect(unsuccessfulResponse.message.getMessageToObservers())
      .toBe(`${opponent.name} dodges ${mobBuilder.mob.name}'s backstab!`)
  })
})
