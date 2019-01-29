import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {RequestType} from "../../../request/requestType"
import {SkillType} from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 1000
let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Hamstring)
})

describe("hamstring skill action", () => {
  it("should not work if already fighting", async () => {
    // setup
    testBuilder.withMob().withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob().mob

    // given
    await testBuilder.fight(target)

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Hamstring, `hamstring ${target.name}`, target))

    // then
    expect(response.isFailure()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe("You are already fighting!")
  })

  it("should be able to succeed and fail hamstring", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSkill(SkillType.Hamstring, MAX_PRACTICE_LEVEL)
    const mob = mobBuilder.mob
    const target = testBuilder.withMob().mob

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Hamstring, `hamstring ${target.name}`, target)))

    // then
    const successResponse = responses.find(response => response.isSuccessful())
    expect(successResponse).toBeDefined()
    expect(successResponse.message.getMessageToRequestCreator())
      .toBe(`you slice ${target.name}'s hamstring! They can barely move!`)
    expect(successResponse.message.getMessageToTarget())
      .toBe(`${mob.name} slices your hamstring! You can barely move!`)
    expect(successResponse.message.getMessageToObservers())
      .toBe(`${mob.name} slices ${target.name}'s hamstring! They can barely move!`)

    // and
    const failResponse = responses.find(response => !response.isSuccessful())
    expect(failResponse).toBeDefined()
    expect(failResponse.message.getMessageToRequestCreator())
      .toBe(`you attempt to hamstring ${target.name} but fail.`)
    expect(failResponse.message.getMessageToTarget())
      .toBe(`${mob.name} attempts to hamstring you but fails.`)
    expect(failResponse.message.getMessageToObservers())
      .toBe(`${mob.name} attempts to hamstring ${target.name} but fails.`)
  })
})
