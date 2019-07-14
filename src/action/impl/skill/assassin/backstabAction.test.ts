import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/service/mobService"
import {ConditionMessages as AllMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import Response from "../../../../request/response"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 1000
let testRunner: TestRunner
let mobBuilder: MobBuilder
let opponent: MobBuilder
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  mobBuilder = testRunner.createMob()
  opponent = testRunner.createMob()
  testRunner.fight(opponent.mob)
})

describe("backstab skill action", () => {
  it("requires having the skill", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Backstab)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(AllMessages.All.NoSkill)
  })

  it("fails when not practiced", async () => {
    // given
    mobBuilder.setLevel(20)
      .withSkill(SkillType.Backstab)

    // when
    const responses = await doNTimes(iterations, () =>
      testRunner.invokeAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isFailure()).length).toBeGreaterThan(iterations * 0.3)
  })

  it("succeeds sometimes when partially practiced", async () => {
    // given
    mobBuilder.setLevel(30)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await doNTimes(iterations, () =>
      testRunner.invokeAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 3)
  })

  it("bounces off an orb of touch", async () => {
    // given
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL).setLevel(30)
    opponent.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(RequestType.Backstab)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${opponent.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${mobBuilder.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} bounces off of ${opponent.getMobName()}'s orb of touch.`)
  })

  it("succeeds sometimes when fully practiced", async () => {
    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      testRunner.invokeAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.90)
  })

  it("starts a fight", async () => {
    testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    opponent = testRunner.createMob()

    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    await testRunner.invokeAction(
        RequestType.Backstab,
        `backstab ${opponent.getMobName()}`,
        opponent.get())

    // then
    expect(mobService.findFightForMob(mobBuilder.get()).get()).toBeDefined()
  })

  it("generates the right messages", async () => {
    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      testRunner.invokeAction(RequestType.Backstab))

    // then -- success
    const successfulResponse: Response = responses.find(r => r.isSuccessful())
    expect(successfulResponse.getMessageToRequestCreator())
      .toBe(`you backstab ${opponent.getMobName()}!`)
    expect(successfulResponse.getMessageToTarget())
      .toBe(`${mobBuilder.mob.name} backstabs you!`)
    expect(successfulResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} backstabs ${opponent.getMobName()}!`)

    // and -- failure
    const unsuccessfulResponse: Response = responses.find(r => r.isFailure())
    expect(unsuccessfulResponse.getMessageToRequestCreator())
      .toBe(`${opponent.getMobName()} dodges your backstab!`)
    expect(unsuccessfulResponse.getMessageToTarget())
      .toBe(`you dodge ${mobBuilder.mob.name}'s backstab!`)
    expect(unsuccessfulResponse.getMessageToObservers())
      .toBe(`${opponent.getMobName()} dodges ${mobBuilder.mob.name}'s backstab!`)
  })
})
