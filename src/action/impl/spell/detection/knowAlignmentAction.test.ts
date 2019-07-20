import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  const mob = await testRunner.createMob()
  mob.setLevel(30)
    .withSpell(SpellType.KnowAlignment, MAX_PRACTICE_LEVEL)
})

describe("know alignment spell action", () => {
  it.each([
    [-1000, " is evil."],
    [0, " is neutral."],
    [1000, " is good."],
  ])("generates accurate success messages for %s alignment number", async (amount: any, message) => {
    // given
    const target = (await testRunner.createMob()).setAlignment(amount)

    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast 'know alignment' ${target.getMobName()}`,
        target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(target.getMobName() + message)
  })
})
