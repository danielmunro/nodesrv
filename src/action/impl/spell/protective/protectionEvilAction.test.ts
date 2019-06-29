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
const expectedMessage = "you are engulfed in a white aura."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.ProtectionEvil, MAX_PRACTICE_LEVEL)
})

describe("protection evil spell action", () => {
  it("applies the affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast 'protection evil'", caster.get())

    // then
    expect(caster.hasAffect(AffectType.ProtectionEvil)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast 'protection evil'", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} is engulfed in a white aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = testRunner.createMob()

    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'protection evil' ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is engulfed in a white aura.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is engulfed in a white aura.`)
  })
})
