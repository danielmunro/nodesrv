import {createTestAppContainer} from "../../../../app/factory/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { SkillMessages } from "../../../../mob/skill/constants"
import { SkillType } from "../../../../mob/skill/skillType"
import { RequestType } from "../../../../request/enum/requestType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const COMMAND = "envenom axe"
const iterations = 100
let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = (await testRunner.createMob()).setLevel(20)
})

describe("envenom skill action", () => {
  it("fails at low levels", async () => {
    // given
    mobBuilder.addItem(testRunner.createWeapon().asAxe().build())
      .withSkill(SkillType.Envenom)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Envenom, COMMAND)

    // then
    expect(responses.filter(response => response.isFailure()).length).toBeGreaterThanOrEqual(iterations * 0.75)
  })

  it("should succeed sometimes with sufficient practice", async () => {
    // setup
    const weapon = testRunner.createWeapon().asAxe()

    mobBuilder.addItem(weapon.build())
      .withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, async () => {
      weapon.resetAffects()
      return testRunner.invokeAction(RequestType.Envenom, COMMAND)
    })

    // then
    expect(responses.filter(response => response.isSuccessful()).length).toBeGreaterThan(1)
  })

  it("should not be able to envenom a non weapon", async () => {
    // given
    mobBuilder
      .withSkill(SkillType.Envenom)
      .addItem(testRunner.createItem().asHelmet().build())

    // when
    const response = await testRunner.invokeAction(RequestType.Envenom, "envenom cap")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(SkillMessages.Envenom.Error.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    // given
    mobBuilder
      .withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)
      .addItem(testRunner.createWeapon().asMace().build())

    // when
    const response = await testRunner.invokeAction(RequestType.Envenom, "envenom mace")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(SkillMessages.Envenom.Error.WrongWeaponType)
  })

  it("generates accurate messages", async () => {
    // setup
    const item = testRunner.createWeapon().asAxe().build()

    // given
    mobBuilder
      .withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL / 2)
      .addItem(item)

    // when
    const responses = await doNTimes(
      iterations,
      () => testRunner.invokeAction(RequestType.Envenom, COMMAND))

    // then
    const successResponse = responses.find(response => response.isSuccessful()).message
    expect(successResponse.getMessageToRequestCreator())
      .toBe(`you successfully envenom ${item.name}.`)
    expect(successResponse.getMessageToTarget())
      .toBe(`you successfully envenom ${item.name}.`)
    expect(successResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} successfully envenoms ${item.name}.`)

    const failResponse = responses.find(response => !response.isSuccessful()).message
    expect(failResponse.getMessageToRequestCreator())
      .toBe(`you fail to envenom ${item.name}.`)
    expect(failResponse.getMessageToTarget())
      .toBe(`you fail to envenom ${item.name}.`)
    expect(failResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} fails to envenom ${item.name}.`)
  })
})
