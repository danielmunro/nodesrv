import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import Response from "../../../../request/response"
import {ConditionMessages as AllMessages} from "../../../../skill/constants"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

const iterations = 1000
let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let opponent: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
  opponent = testBuilder.withMob()
  await testBuilder.fight(opponent.mob)
})

describe("backstab skill action", () => {
  it("requires having the skill", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Backstab)

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
      testBuilder.handleAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isFailure()).length).toBeGreaterThan(iterations * 0.3)
  })

  it("succeeds sometimes when partially practiced", async () => {
    // given
    mobBuilder.setLevel(30)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 3)
  })

  it("bounces off an orb of touch", async () => {
    // given
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL).setLevel(30)
    opponent.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(RequestType.Backstab)

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe(`you bounce off of ${opponent.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${mobBuilder.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} bounces off of ${opponent.getMobName()}'s orb of touch.`)
  })

  it("succeeds sometimes when fully practiced", async () => {
    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.Backstab))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.90)
  })

  it("starts a fight", async () => {
    testBuilder = new TestBuilder()
    mobBuilder = testBuilder.withMob()
    opponent = testBuilder.withMob()

    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Backstab,
        `backstab ${opponent.getMobName()}`,
        opponent.mob))

    // then
    const mobService = await testBuilder.getMobService()
    expect(mobService.getFightCount()).toBe(1)
  })

  it("generates the right messages", async () => {
    // given
    mobBuilder.setLevel(50)
      .withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.Backstab))

    // then -- success
    const successfulResponse: Response = responses.find(r => r.isSuccessful())
    expect(successfulResponse.message.getMessageToRequestCreator())
      .toBe(`you backstab ${opponent.getMobName()}!`)
    expect(successfulResponse.message.getMessageToTarget())
      .toBe(`${mobBuilder.mob.name} backstabs you!`)
    expect(successfulResponse.message.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} backstabs ${opponent.getMobName()}!`)

    // and -- failure
    const unsuccessfulResponse: Response = responses.find(r => r.isFailure())
    expect(unsuccessfulResponse.message.getMessageToRequestCreator())
      .toBe(`${opponent.getMobName()} dodges your backstab!`)
    expect(unsuccessfulResponse.message.getMessageToTarget())
      .toBe(`you dodge ${mobBuilder.mob.name}'s backstab!`)
    expect(unsuccessfulResponse.message.getMessageToObservers())
      .toBe(`${opponent.getMobName()} dodges ${mobBuilder.mob.name}'s backstab!`)
  })
})
