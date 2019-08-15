import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {SpellType} from "../../../../mob/spell/spellType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobEntity
let target: MobEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob()).withSpell(SpellType.Fireball, MAX_PRACTICE_LEVEL).get()
  target = (await testRunner.createMob()).get()
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
