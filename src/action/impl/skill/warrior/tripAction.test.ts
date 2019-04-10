import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {ConditionMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../support/test/testBuilder"
import Action from "../../../action"

const ITERATIONS = 1000
let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Trip)
})

describe("trip skill action", () => {
  it("can fail tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.addSkill(SkillType.Trip)

    // and
    await testBuilder.fight()

    // when
    const responses = await doNTimes(ITERATIONS,
      () => action.handle(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(responses.some(result => !result.isSuccessful())).toBeTruthy()
  })

  it("can succeed tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // and
    await testBuilder.fight()

    // when
    const results = await doNTimes(ITERATIONS,
      () => action.handle(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(results.some(result => result.isSuccessful())).toBeTruthy()
  })

  it("bounces off an orb of touch", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL).setLevel(30)
    const target = testBuilder.withMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(
      RequestType.Trip,
      `trip ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${playerBuilder.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${playerBuilder.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("need movement to work", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.vitals.mv = 0
      p.sessionMob.level = 10
    })
    await testBuilder.fight()

    // given
    playerBuilder.addSkill(SkillType.Trip)

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
    playerBuilder.addSkill(SkillType.Trip)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(response.isError()).toBeFalsy()
  })

  it("generates accurate messages", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
    const target = testBuilder.withMob().mob
    await testBuilder.fight(target)

    // given
    playerBuilder.addSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(ITERATIONS, () => action.handle(testBuilder.createRequest(RequestType.Trip)))

    // then
    const successMessage = responses.find(response => response.isSuccessful()).message
    expect(successMessage.getMessageToRequestCreator())
      .toBe(`you trip ${target.name}!`)
    expect(successMessage.getMessageToTarget())
      .toBe(`${playerBuilder.player.sessionMob} trips you!`)
    expect(successMessage.getMessageToObservers())
      .toBe(`${playerBuilder.player.sessionMob} trips ${target.name}!`)

    const failMessage = responses.find(response => !response.isSuccessful()).message
    expect(failMessage.getMessageToRequestCreator())
      .toBe(`you fail to trip ${target.name}!`)
    expect(failMessage.getMessageToTarget())
      .toBe(`${playerBuilder.player.sessionMob} fails to trip you!`)
    expect(failMessage.getMessageToObservers())
      .toBe(`${playerBuilder.player.sessionMob} fails to trip ${target.name}!`)
  })
})
