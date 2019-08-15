import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder

const expectedMessage = "your curse has lifted."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .withSpell(SpellType.RemoveCurse, MAX_PRACTICE_LEVEL)
    .setLevel(20)
  target = (await testRunner.createMob())
    .addAffectType(AffectType.Curse)
})

describe("remove curse spell action", () => {
  it("can remove a curse", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast remove ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.Curse)).toBeFalsy()
  })

  it("requires a curse in the first place", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast remove`, caster.get())

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(SpellMessages.RemoveCurse.RequiresAffect)
  })

  it("generates accurate success messages for targets", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast remove ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s curse has lifted.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()}'s curse has lifted.`)
  })

  it("generates accurate success messages for self", async () => {
    // given
    caster.addAffectType(AffectType.Curse)

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast remove", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()}'s curse has lifted.`)
  })
})
