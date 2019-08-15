import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const expectedMessage = "you feel more powerful than death."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = await testRunner.createMob()
})

describe("withstand death spell action", () => {
  it("imparts withstand death affect type", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL)
      .setLevel(30)

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast withstand", caster.get())

    // then
    expect(caster.hasAffect(AffectType.WithstandDeath)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL)
      .setLevel(30)

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast withstand", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} feels more powerful than death.`)
  })

  it("generates accurate success messages on a target", async () => {
    // given
    caster.withSpell(SpellType.WithstandDeath, MAX_PRACTICE_LEVEL)
      .setLevel(30)
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast withstand ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels more powerful than death.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels more powerful than death.`)
  })
})
