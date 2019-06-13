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
  caster = testRunner.createMob().withSpell(SpellType.Fireball, MAX_PRACTICE_LEVEL).get()
  target = testRunner.createMob().get()
})

describe("fireball action", () => {
  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast fireball ${target}`, target)

    // then
    expect(response.getMessageToRequestCreator()).toMatch(
      new RegExp(`your ball of fire (hits|grazes|scratches) ${target}.`))
    expect(response.getMessageToTarget()).toMatch(
      new RegExp(`${caster}'s ball of fire (hits|grazes|scratches) you.`))
    expect(response.getMessageToObservers()).toMatch(
      new RegExp(`${caster}'s ball of fire (hits|grazes|scratches) ${target}.`))
  })
})
