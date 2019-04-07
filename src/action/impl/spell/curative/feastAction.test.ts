import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let mobBuilder: PlayerBuilder
const expectedMessage = "you feel satiated."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = await testBuilder.withPlayer()
  mobBuilder.setLevel(20)
})

describe("feast action", () => {
  it("satisfies hunger", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)

    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast feast", mobBuilder.getMob()))

    expect(mobBuilder.getMob().playerMob.hunger).toBe(mobBuilder.getMob().playerMob.appetite)
  })

  it("generates accurate success messages on self", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast feast", mobBuilder.getMob()))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} feels satiated.`)
  })

  it("generates accurate success messages on target", async () => {
    // given
    mobBuilder.addSpell(SpellType.Feast, MAX_PRACTICE_LEVEL)
    const target = await testBuilder.withPlayer()

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast feast ${target.getMobName()}`, target.getMob()))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} feels satiated.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} feels satiated.`)
  })
})
