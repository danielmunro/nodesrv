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

const RESPONSE1 = "your muscles surge with heightened power."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = await testRunner.createMob()
})

describe("giant strength spell action", () => {
  it("imparts the giant strength affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast giant ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.GiantStrength)).toBeTruthy()
  })

  it("generates accurate success messages when casting against a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast giant ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`${target.getMobName()}'s muscles surge with heightened power.`)
    expect(response.getMessageToTarget()).toBe(RESPONSE1)
    expect(response.getMessageToObservers())
      .toBe(`${target.getMobName()}'s muscles surge with heightened power.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast giant", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(RESPONSE1)
    expect(response.getMessageToTarget()).toBe(RESPONSE1)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()}'s muscles surge with heightened power.`)
  })
})
