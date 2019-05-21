import {createTestAppContainer} from "../../../../app/factory/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { RequestType } from "../../../../request/enum/requestType"
import { SpellType } from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .setLevel(30)
    .withSpell(SpellType.LightningBolt, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("lightning bolt", () => {
  it("does damage when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, `cast lightning ${target.getMobName()}`, target.get())

    // then
    const attr = target.mob.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })
})
