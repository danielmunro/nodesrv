import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobBuilder: MobBuilder
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
    .setLevel(20)
    .withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("blind spell action", () => {
  it("should impart a blinding affect on success", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast blind ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.Blind)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast blind ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is suddenly blind!`)
    expect(response.getMessageToTarget()).toBe("you are suddenly blind!")
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is suddenly blind!`)
  })

  it("should error out if applied twice", async () => {
    // given
    target.addAffectType(AffectType.Blind)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Cast, `cast blind ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
