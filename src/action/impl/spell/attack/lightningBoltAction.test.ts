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
    .withSpell(SpellType.LightningBolt, MAX_PRACTICE_LEVEL)
    .get()
  target = (await testRunner.createMob()).get()
})

describe("lightning bolt", () => {
  it("does damage when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, `cast lightning ${target}`, target)

    // then
    const attr = target.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast lightning ${target}`, target)

    // then
    expect(response.getMessageToRequestCreator())
      .toMatch(new RegExp(`your bolt of lightning (grazes|hits|scratches) ${target}.`))
    expect(response.getMessageToTarget())
      .toMatch(new RegExp(`${caster}'s bolt of lightning (grazes|hits|scratches) you.`))
    expect(response.getMessageToObservers())
      .toMatch(new RegExp(`${caster}'s bolt of lightning (grazes|hits|scratches) ${target}.`))
  })
})
