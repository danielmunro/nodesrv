import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import { SkillMessages } from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"

const COMMAND = "envenom axe"
const iterations = 100
let testBuilder: TestBuilder
let mobBuilder: MobBuilder

function equipWeaponToMob() {
  return testBuilder.withWeapon()
    .asAxe()
    .addToMobBuilder(mobBuilder)
    .build()
}

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob().withLevel(20)
})

describe("envenom skill action", () => {
  it("should fail at low levels", async () => {
    // given
    equipWeaponToMob()
    mobBuilder.withSkill(SkillType.Envenom)

    // when
    const responses = await doNTimes(iterations,
      () => testBuilder.handleAction(RequestType.Envenom, COMMAND))

    // then
    expect(responses.filter(response => response.isFailure()).length).toBeGreaterThanOrEqual(iterations * 0.9)
  })

  it("should succeed sometimes with sufficient practice", async () => {
    // setup
    const weapon = equipWeaponToMob()
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, async () => {
      weapon.affects = []
      return testBuilder.handleAction(RequestType.Envenom, COMMAND)
    })

    // then
    expect(responses.filter(response => response.isSuccessful()).length).toBeGreaterThan(1)
  })

  it("should not be able to envenom a non weapon", async () => {
    // setup
    mobBuilder.withSkill(SkillType.Envenom)

    // given
    testBuilder.withItem().asHelmet().addToMobBuilder(mobBuilder).build()

    // when
    const response = await testBuilder.handleAction(RequestType.Envenom, "envenom cap")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(SkillMessages.Envenom.Error.NotAWeapon)
  })

  it("should only be able to envenom bladed weapons", async () => {
    // setup
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // given
    testBuilder.withWeapon().asMace().addToMobBuilder(mobBuilder).build()

    // when
    const response = await testBuilder.handleAction(RequestType.Envenom, "envenom mace")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(SkillMessages.Envenom.Error.WrongWeaponType)
  })

  it("generates accurate messages", async () => {
    // setup
    const item = equipWeaponToMob()
    mobBuilder.withSkill(SkillType.Envenom, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(
      iterations,
      () => testBuilder.handleAction(RequestType.Envenom, COMMAND))

    // then
    const successResponse = responses.find(response => response.isSuccessful()).message
    expect(successResponse.getMessageToRequestCreator())
      .toBe(`you successfully envenom ${item.name}.`)
    expect(successResponse.getMessageToTarget())
      .toBe(`${mobBuilder.mob.name} successfully envenoms ${item.name}.`)
    expect(successResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} successfully envenoms ${item.name}.`)

    const failResponse = responses.find(response => !response.isSuccessful()).message
    expect(failResponse.getMessageToRequestCreator())
      .toBe(`you fail to envenom ${item.name}.`)
    expect(failResponse.getMessageToTarget())
      .toBe(`${mobBuilder.mob.name} fails to envenom ${item.name}.`)
    expect(failResponse.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name} fails to envenom ${item.name}.`)
  })
})
