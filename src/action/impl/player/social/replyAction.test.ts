import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"

let testRunner: TestRunner
let player1: PlayerBuilder
let player2: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player1 = await testRunner.createPlayer()
  player2 = await testRunner.createPlayer()
})

describe("reply action", () => {
  it("works when last tell is set", async () => {
    // given
    await testRunner.invokeAction(RequestType.Tell, `tell '${player2.getMobName()}' hello world`)

    // when
    const response = await testRunner.invokeActionAs(player2.getMob(), RequestType.Reply, `reply well hello there`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You reply to ${player1.getMobName()}, "well hello there"`)
  })

  it("does not work when last tell is not set", async () => {
    // when
    const response = await testRunner.invokeActionAs(player2.getMob(), RequestType.Reply, `reply well hello there`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Reply.NoLastTell)
  })
})
