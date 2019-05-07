import {AffectType} from "../../../../affect/affectType"
import {createTestAppContainer} from "../../../../inversify.config"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const expectedMessage = "you fall silent."
let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .setLevel(30)
    .withSpell(SpellType.HolySilence)
  target = testRunner.createMob()
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
