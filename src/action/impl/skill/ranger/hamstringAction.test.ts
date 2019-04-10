import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../support/test/testBuilder"

const iterations = 1000
let testBuilder: TestBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
})

describe("hamstring skill action", () => {
  it("should not work if already fighting", async () => {
    // setup
    testBuilder.withMob().withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob()

    // given
    await testBuilder.fight(target.mob)

    // when
    const response = await testBuilder.handleAction(RequestType.Hamstring, `hamstring ${target.getMobName()}`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe("You are already fighting!")
  })

  it("bounces off an orb of touch", async () => {
    // given
    const attacker = testBuilder.withMob().withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(
      RequestType.Hamstring,
      `hamstring ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${attacker.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${attacker.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("should be able to succeed and fail hamstring", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const mob = mobBuilder.mob
    const target = testBuilder.withMob()

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.Hamstring, `hamstring '${target.getMobName()}'`, target.mob))

    // then
    const successResponse = responses.find(response => response.isSuccessful())
    expect(successResponse).toBeDefined()
    expect(successResponse.message.getMessageToRequestCreator())
      .toBe(`you slice ${target.getMobName()}'s hamstring! They can barely move!`)
    expect(successResponse.message.getMessageToTarget())
      .toBe(`${mob.name} slices your hamstring! You can barely move!`)
    expect(successResponse.message.getMessageToObservers())
      .toBe(`${mob.name} slices ${target.getMobName()}'s hamstring! They can barely move!`)

    // and
    const failResponse = responses.find(response => response.isFailure())
    expect(failResponse).toBeDefined()
    expect(failResponse.message.getMessageToRequestCreator())
      .toBe(`you attempt to hamstring ${target.getMobName()} but fail.`)
    expect(failResponse.message.getMessageToTarget())
      .toBe(`${mob.name} attempts to hamstring you but fails.`)
    expect(failResponse.message.getMessageToObservers())
      .toBe(`${mob.name} attempts to hamstring ${target.getMobName()} but fails.`)
  })
})
