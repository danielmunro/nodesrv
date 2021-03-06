import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const expectedMessage = "you fall silent."
let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(30)
    .withSpell(SpellType.HolySilence, MAX_PRACTICE_LEVEL)
  target = await testRunner.createMob()
})

describe("holy silence spell action", () => {
  it("when successful, imparts the holy silence affect type", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
        RequestType.Cast, `cast 'holy silence' ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.HolySilence)).toBeTruthy()
  })

  it("generates accurate success message casting on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'holy silence' ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} falls silent.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} falls silent.`)
  })

  it("generates accurate success message casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast 'holy silence' ${caster.getMobName()}`,
        caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} falls silent.`)
  })
})
