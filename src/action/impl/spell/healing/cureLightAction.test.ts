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
const defaultMessage = "you feel better!"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(20)
    .withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
  target = await testRunner.createMob()
})

describe("cure light", () => {
  it("heals a target when casted", async () => {
    // setup
    target.setHp(1)

    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure light' ${target.getMobName()}`, target.get())

    // then
    expect(target.getHp()).toBeGreaterThan(1)
  })

  it("heals self when casted", async () => {
    // setup
    target.setHp(1)

    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure light' ${target.getMobName}`, target.get())

    // then
    expect(target.getHp()).toBeGreaterThan(1)
  })

  it("generates accurate success messages when casting on target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'cure light' ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels better!`)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels better!`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'cure light'", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(defaultMessage)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} feels better!`)
  })
})
