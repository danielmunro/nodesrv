import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  const mob = await testRunner.createMob()
  mob.withSpell(SpellType.Poison, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = await testRunner.createMob()
})

describe("poison spell action", () => {
  it("imparts poison on success", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast poison ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.Poison)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast poison ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`${target.getMobName()} suddenly feels sick!`)
    expect(response.getMessageToTarget()).toBe("you suddenly feel sick!")
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} suddenly feels sick!`)
  })
})
