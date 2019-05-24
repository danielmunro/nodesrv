import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: Mob
let target: Mob

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob().withSpell(SpellType.ChillTouch, MAX_PRACTICE_LEVEL).get()
  target = testRunner.createMob().get()
})

describe("chill touch action", () => {
  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast chill ${target}`, target)

    // then
    expect(response.getMessageToRequestCreator()).toMatch(
      new RegExp(`your chilling touch (scratches|grazes) ${target}.`))
    expect(response.getMessageToTarget()).toMatch(
      new RegExp(`${caster}'s chilling touch (scratches|grazes) you.`))
    expect(response.getMessageToObservers()).toMatch(
      new RegExp(`${caster}'s chilling touch (scratches|grazes) ${target}.`))
  })
})
