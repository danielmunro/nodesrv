import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobBuilder: PlayerBuilder
const expectedMessage = "you feel satiated."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = (await testRunner.createPlayer())
    .setLevel(20)
})

describe("feast action", () => {
  it("satisfies hunger", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast feast", mobBuilder.getMob())

    expect(mobBuilder.getMob().playerMob.hunger).toBe(mobBuilder.getMob().playerMob.appetite)
  })

  it("generates accurate success messages on self", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast feast", mobBuilder.getMob())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} feels satiated.`)
  })

  it("generates accurate success messages on target", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)
    const target = await testRunner.createPlayer()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast feast ${target.getMobName()}`, target.getMob())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels satiated.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} feels satiated.`)
  })
})
