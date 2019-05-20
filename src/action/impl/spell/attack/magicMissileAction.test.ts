import {createTestAppContainer} from "../../../../app/testFactory"
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
    .withSpell(SpellType.MagicMissile, MAX_PRACTICE_LEVEL)
  target = testRunner.createMob()
})

describe("magic missile", () => {
  it("does damage when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast magic ${target.getMobName()}`, target.get())

    // then
    const attr = target.mob.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })
})
