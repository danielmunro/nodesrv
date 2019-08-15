import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder
const defaultMessage = "a warm wave flows through you."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(30)
    .withSpell(SpellType.Heal, MAX_PRACTICE_LEVEL)
  target = await testRunner.createMob()
})

describe("heal spell action", () => {
  it("heals a target when casted", async () => {
    // setup
    target.setHp(1)

    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast heal '${target.getMobName()}'`, target.get())

    // then
    expect(target.getHp()).toBeGreaterThan(1)
  })

  it("generates accurate success messages when casting on target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast heal '${target.getMobName()}`,
        target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a warm wave flows through ${target.getMobName()}.`)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`a warm wave flows through ${target.getMobName()}.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        "cast 'heal'",
        caster.mob)

    // then
    expect(response.getMessageToRequestCreator()).toBe(defaultMessage)
    expect(response.getMessageToTarget()).toBe(defaultMessage)
    expect(response.getMessageToObservers()).toBe(`a warm wave flows through ${caster.getMobName()}.`)
  })
})
