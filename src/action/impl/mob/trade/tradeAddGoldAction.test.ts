import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Escrow from "../../../../mob/trade/escrow"
import EscrowParticipant from "../../../../mob/trade/escrowParticipant"
import EscrowService from "../../../../mob/trade/escrowService"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let requester: MobBuilder
let trader: MobBuilder
let escrow: Escrow
const input = "trade add 10 gold"

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  requester = await testRunner.createMob()
  requester.setGold(100)
  trader = await testRunner.createMob()
  trader.setGold(100)
  escrow = new Escrow([
    new EscrowParticipant(requester.get()),
    new EscrowParticipant(trader.get())])
  const escrowService = app.get<EscrowService>(Types.EscrowService)
  escrowService.addEscrow(escrow)
})

describe("trade add gold action", () => {
  it("generates accurate messages", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.TradeAdd, input)

    // then
    const message = "10 gold has been added to escrow."
    expect(response.getMessageToRequestCreator()).toBe(message)
    expect(response.getMessageToTarget()).toBe(message)
    expect(response.getMessageToObservers()).toBe(message)
  })

  it("removes gold from the requester's inventory", async () => {
    // when
    await testRunner.invokeAction(RequestType.TradeAdd, input)

    // then
    expect(requester.getGold()).toBe(90)
  })

  it("removes an item from the trader's inventory", async () => {
    // when
    await testRunner.invokeActionAs(trader.get(), RequestType.TradeAdd, input)

    // then
    expect(trader.getGold()).toBe(90)
  })
})
