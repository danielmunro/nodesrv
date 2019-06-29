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
const expectedMessage = "your will cannot be broken."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.TowerOfIronWill, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("tower of iron will spell action", () => {
  it("imparts the affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast tower", caster.get())

    // then
    expect(caster.hasAffect(AffectType.TowerOfIronWill)).toBeTruthy()
  })

  it("generates accurate success messages against self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast tower", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()}'s will cannot be broken.`)
  })

  it("generates accurate success messages against a target", async () => {
    // given
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast tower ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s will cannot be broken.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()}'s will cannot be broken.`)
  })
})
