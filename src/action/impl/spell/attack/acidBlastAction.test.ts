import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobEntity
let target: MobEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob().withSpell(SpellType.AcidBlast, MAX_PRACTICE_LEVEL).get()
  target = testRunner.createMob().get()
})

describe("acid blast spell action", () => {
  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast acid ${target}`, target)

    // then
    expect(response.getMessageToRequestCreator())
      .toEqual(`your blast of acid hits ${target}.`)
    expect(response.getMessageToTarget())
      .toEqual(`${caster}'s blast of acid hits you.`)
    expect(response.getMessageToObservers())
      .toEqual(`${caster}'s blast of acid hits ${target}.`)
  })
})
