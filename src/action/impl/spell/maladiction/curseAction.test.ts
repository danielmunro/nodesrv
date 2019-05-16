import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob().setLevel(20)
    .withSpell(SpellType.Curse, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("curse spell action", () => {
  it("imparts a curse on a target", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast curse ${target.getMobName()}`, target.get())

    // then
    expect(target.hasAffect(AffectType.Curse)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast curse ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is cursed!`)
    expect(response.getMessageToTarget()).toBe(`you are cursed!`)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is cursed!`)
  })
})
