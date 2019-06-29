import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import Response from "../../../../request/response"
import {ConditionMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 1000
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("trip skill action", () => {
  it("can fail tripping", async () => {
    // setup
    testRunner.createPlayer()
      .setLevel(40)
      .addSkill(SkillType.Trip)
    testRunner.fight()

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Trip)

    // then
    expect(responses.some(result => !result.isSuccessful())).toBeTruthy()
  })

  it("can succeed tripping", async () => {
    // given
    testRunner.createPlayer()
      .setLevel(40)
      .addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)
    testRunner.fight()

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Trip)

    // then
    expect(response).toBeDefined()
  })

  it("bounces off an orb of touch", async () => {
    // given
    const playerBuilder = testRunner.createPlayer()
    playerBuilder.addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL).setLevel(30)
    const target = testRunner.createMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await testRunner.invokeAction(
        RequestType.Trip,
        `trip ${target.getMobName()}`,
        target.mob)
      return handled.isFailure() ? handled : null
    })

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${playerBuilder.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${playerBuilder.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("need movement to work", async () => {
    // given
    testRunner.createPlayer()
      .setLevel(10)
      .setMv(0)
      .addSkill(SkillType.Trip)
    testRunner.fight()

    // when
    const response = await testRunner.invokeAction(RequestType.Trip)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.NotEnoughMv)
  })

  it("success sanity createDefaultCheckFor", async () => {
    // setup
    testRunner.createPlayer()
      .setLevel(10)
      .addSkill(SkillType.Trip)
    testRunner.fight()

    // when
    const response = await testRunner.invokeAction(RequestType.Trip)

    // then
    expect(response.isError()).toBeFalsy()
  })

  it("generates accurate messages", async () => {
    // setup
    const playerBuilder = testRunner.createPlayer()
      .setLevel(10)
    const target = testRunner.createMob()
    testRunner.fight(target.get())

    // given
    playerBuilder.addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Trip)

    // then
    const successResponse = responses.find(response => response.isSuccessful()) as Response
    expect(successResponse.getMessageToRequestCreator())
      .toBe(`you trip ${target.getMobName()}!`)
    expect(successResponse.getMessageToTarget())
      .toBe(`${playerBuilder.player.sessionMob} trips you!`)
    expect(successResponse.getMessageToObservers())
      .toBe(`${playerBuilder.player.sessionMob} trips ${target.getMobName()}!`)

    const failResponse = responses.find(response => !response.isSuccessful()) as Response
    expect(failResponse.getMessageToRequestCreator())
      .toBe(`you fail to trip ${target.getMobName()}!`)
    expect(failResponse.getMessageToTarget())
      .toBe(`${playerBuilder.player.sessionMob} fails to trip you!`)
    expect(failResponse.getMessageToObservers())
      .toBe(`${playerBuilder.player.sessionMob} fails to trip ${target.getMobName()}!`)
  })
})
