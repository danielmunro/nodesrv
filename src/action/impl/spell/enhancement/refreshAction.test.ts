import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const expectedMessage = "you feel refreshed."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .setLevel(30)
    .withSpell(SpellType.RefreshMovement, MAX_PRACTICE_LEVEL)
})

describe("refresh spell action", () => {
  it("generates mv for a target", async () => {
    // given
    caster.setMv(1)

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast refresh", caster.get())

    // then
    expect(caster.mob.mv).toBeGreaterThan(1)
  })

  it("generates correct success messages on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast refresh", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} feels refreshed.`)
  })

  it("generates correct success messages on target", async () => {
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast refresh '${target.getMobName()}'`,
        target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels refreshed.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels refreshed.`)
  })
})
