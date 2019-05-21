import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobBuilder: MobBuilder
const expectedMessage = "you feel blessed."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
})

describe("bless action", () => {
  it("generates accurate success messages when casting against self", async () => {
    // given
    mobBuilder.withSpell(SpellType.Bless, MAX_PRACTICE_LEVEL)

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast bless", mobBuilder.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} feels blessed.`)
  })

  it("generates accurate success messages when casting against a target", async () => {
    // given
    mobBuilder.withSpell(SpellType.Bless, MAX_PRACTICE_LEVEL)
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast bless '${target.getMobName()}'`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.mob} feels blessed.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.mob} feels blessed.`)
  })
})
