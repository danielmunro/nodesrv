import {createTestAppContainer} from "../../../../app/factory/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import { SpellType } from "../../../../mob/spell/spellType"
import { RequestType } from "../../../../request/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobEntity
let target: MobEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(30)
    .withSpell(SpellType.MagicMissile, MAX_PRACTICE_LEVEL)
    .get()
  target = (await testRunner.createMob()).get()
})

describe("magic missile", () => {
  it("does damage when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast magic ${target}`, target)

    // then
    const attr = target.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast magic ${target}`, target)

    // then
    expect(response.getMessageToRequestCreator())
      .toMatch(new RegExp(`your magic missile (gives|scratches) ${target}( a bruise|).`))
    expect(response.getMessageToTarget())
      .toMatch(new RegExp(`${caster}'s magic missile (gives|scratches) you( a bruise|).`))
    expect(response.getMessageToObservers())
      .toMatch(new RegExp(`${caster}'s magic missile (gives|scratches) ${target}( a bruise|).`))
  })
})
