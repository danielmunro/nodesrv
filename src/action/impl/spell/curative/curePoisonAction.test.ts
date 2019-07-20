import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder

const MESSAGE_FEELS_LESS_SICK = "you feel less sick."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .withSpell(SpellType.CurePoison, MAX_PRACTICE_LEVEL)
    .setLevel(20)
  target = await testRunner.createMob()
  target.addAffectType(AffectType.Poison)
})

describe("cure poison", () => {
  it("cures poison when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure poison' '${target.getMobName()}'`, target.get())

    // then
    expect(target.mob.affect().isPoisoned()).toBeFalsy()
  })

  it("generates accurate success messages for targets", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure poi' '${target.getMobName()}'`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels less sick.`)
    expect(response.getMessageToTarget()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels less sick.`)
  })

  it("generates accurate success messages for self", async () => {
    // given
    caster.addAffectType(AffectType.Poison)

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast 'cure poison'", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.getMessageToTarget()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} feels less sick.`)
  })
})
