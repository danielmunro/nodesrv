import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder
const expectedMessage = "you begin moving quickly."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .setLevel(20)
    .withSpell(SpellType.Haste, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("haste spell action", () => {
  it("imparts the haste affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast haste", caster.get())

    // then
    expect(caster.hasAffect(AffectType.Haste)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast haste", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} begins moving quickly.`)
  })

  it("generates accurate success messages on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast haste ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} begins moving quickly.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} begins moving quickly.`)
  })
})
