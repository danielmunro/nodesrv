import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Escrow from "../../../../mob/trade/escrow"
import EscrowService from "../../../../mob/trade/escrowService"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let requester: MobBuilder
let trader: MobBuilder
let escrow: Escrow

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  requester = await testRunner.createMob()
  testRunner.createItem().asHelmet().addToMobBuilder(requester).build()
  trader = await testRunner.createMob()
  testRunner.createItem().asShield().addToMobBuilder(trader).build()
  escrow = new Escrow(requester.get(), trader.get())
  const escrowService = app.get<EscrowService>(Types.EscrowService)
  escrowService.addEscrow(escrow)
})

describe("trade add item action", () => {
  it("generates accurate messages", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.TradeAdd, "trade add cap")

    // then
    const message = "a baseball cap has been added to escrow."
    expect(response.getMessageToRequestCreator()).toBe(message)
    expect(response.getMessageToTarget()).toBe(message)
    expect(response.getMessageToObservers()).toBe(message)
  })

  it("removes an item from the requester's inventory", async () => {
    // when
    await testRunner.invokeAction(RequestType.TradeAdd, "trade add cap")

    // then
    expect(requester.getItems()).toHaveLength(0)
  })

  it("removes an item from the trader's inventory", async () => {
    // when
    await testRunner.invokeActionAs(trader.get(), RequestType.TradeAdd, "trade add shield")

    // then
    expect(trader.getItems()).toHaveLength(0)
  })
})
