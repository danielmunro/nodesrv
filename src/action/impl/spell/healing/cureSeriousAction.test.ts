import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder
const defaultMessage = "you feel better!"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .setLevel(20)
    .withSpell(SpellType.CureSerious, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("cure serious", () => {
  it("heals a target when casted", async () => {
    // setup
    target.setHp(1)

    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure serious' '${target.getMobName()}'`, target.get())

    // then
    expect(target.getHp()).toBeGreaterThan(1)
  })

  it("generates accurate success messages when casting on target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast, `cast 'cure serious' '${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels better!`)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels better!`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        "cast 'cure serious'",
        caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(defaultMessage)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} feels better!`)
  })
})
