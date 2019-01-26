import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {RequestType} from "../../../request/requestType"
import {ConditionMessages} from "../../../skill/constants"
import {SkillType} from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Trip)
})

describe("trip skill action", () => {
  it("should be able to fail tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // and
    await testBuilder.fight()

    // when
    const responses = await doNTimes(100,
      () => action.handle(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(responses.some(result => !result.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.withSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // and
    await testBuilder.fight()

    // when
    const results = await doNTimes(10,
      () => action.handle(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(results.some(result => result.isSuccessful())).toBeTruthy()
  })

  it("should not work if the mob is out of movement", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.vitals.mv = 0
      p.sessionMob.level = 10
    })
    await testBuilder.fight()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.NotEnoughMv)
  })

  it("success sanity createDefaultCheckFor", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
    await testBuilder.fight()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(response.isError()).toBeFalsy()
  })
})
