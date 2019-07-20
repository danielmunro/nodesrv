import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  const mob = await testRunner.createMob()
  mob.setLevel(20)
    .withSpell(SpellType.Curse, MAX_PRACTICE_LEVEL)
  target = await testRunner.createMob()
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
