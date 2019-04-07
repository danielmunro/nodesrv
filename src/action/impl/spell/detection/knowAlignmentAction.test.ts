import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  testBuilder.withMob().setLevel(30).withSpell(SpellType.KnowAlignment, MAX_PRACTICE_LEVEL)
})

describe("know alignment spell action", () => {
  it.each([
    [-1000, " is evil."],
    [0, " is neutral."],
    [1000, " is good."],
  ])("generates accurate success messages for %s alignment number", async (amount, message) => {
    // given
    const target = testBuilder.withMob().setAlignment(amount)

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast 'know alignment' ${target.getMobName()}`,
        target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(target.getMobName() + message)
  })
})
