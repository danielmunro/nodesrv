import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import doNTimes from "../../../../support/functional/times"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 1000
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("hamstring skill action", () => {
  it("should not work if already fighting", async () => {
    // setup
    testRunner.createMob().withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testRunner.createMob()

    // given
    testRunner.fight(target.get())

    // when
    const response = await testRunner.invokeAction(RequestType.Hamstring, `hamstring ${target.getMobName()}`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe("You are already fighting!")
  })

  it("bounces off an orb of touch", async () => {
    // given
    const attacker = testRunner.createMob().withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testRunner.createMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Hamstring,
      `hamstring ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("should be able to succeed and fail hamstring", async () => {
    // given
    const aggressor = testRunner.createMob()
      .withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testRunner.createMob()

    // when
    const responses = await doNTimes(iterations, () =>
      testRunner.invokeAction(
        RequestType.Hamstring, `hamstring '${target.getMobName()}'`, target.get()))

    // then
    const successResponse = responses.find(response => response.isSuccessful())
    expect(successResponse).toBeDefined()
    expect(successResponse.getMessageToRequestCreator())
      .toBe(`you slice ${target.getMobName()}'s hamstring! They can barely move!`)
    expect(successResponse.getMessageToTarget())
      .toBe(`${aggressor.getMobName()} slices your hamstring! You can barely move!`)
    expect(successResponse.getMessageToObservers())
      .toBe(`${aggressor.getMobName()} slices ${target.getMobName()}'s hamstring! They can barely move!`)

    // and
    const failResponse = responses.find(response => response.isFailure())
    expect(failResponse).toBeDefined()
    expect(failResponse.getMessageToRequestCreator())
      .toBe(`you attempt to hamstring ${target.getMobName()} but fail.`)
    expect(failResponse.getMessageToTarget())
      .toBe(`${aggressor.getMobName()} attempts to hamstring you but fails.`)
    expect(failResponse.getMessageToObservers())
      .toBe(`${aggressor.getMobName()} attempts to hamstring ${target.getMobName()} but fails.`)
  })
})
