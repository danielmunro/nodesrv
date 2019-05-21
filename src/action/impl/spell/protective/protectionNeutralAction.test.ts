import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const expectedMessage = "you are engulfed in a gray aura."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.ProtectionNeutral, MAX_PRACTICE_LEVEL)
})

describe("protection neutral spell action", () => {
  it("applies the affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'protection neutral'", caster.get())

    // then
    expect(caster.hasAffect(AffectType.ProtectionNeutral)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast 'protection neutral'", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} is engulfed in a gray aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = testRunner.createMob()

    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'protection neutral' ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is engulfed in a gray aura.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is engulfed in a gray aura.`)
  })
})
