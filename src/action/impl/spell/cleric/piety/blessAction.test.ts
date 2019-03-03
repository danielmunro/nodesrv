import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import PlayerBuilder from "../../../../../test/playerBuilder"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
let player: PlayerBuilder
const expectedMessage = "you feel blessed."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
})

describe("bless action", () => {
  it("generates accurate success messages when casting against self", async () => {
    // given
    player.addSpell(SpellType.Bless, MAX_PRACTICE_LEVEL)

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast bless", player.getMob()))

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${player.getMob().name} feels blessed.`)
  })

  it("generates accurate success messages when casting against a target", async () => {
    // given
    player.addSpell(SpellType.Bless, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob()

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast bless '${target.getMobName()}'`, target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.mob} feels blessed.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.mob} feels blessed.`)
  })
})
