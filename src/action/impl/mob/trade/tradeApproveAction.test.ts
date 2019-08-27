import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
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
let helm: ItemEntity
let shield: ItemEntity
const input = "trade approve"

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  requester = await testRunner.createMob()
  requester.setGold(100)
  helm = testRunner.createItem().asHelmet().addToMobBuilder(requester).build()
  trader = await testRunner.createMob()
  shield = testRunner.createItem().asShield().addToMobBuilder(trader).build()
  trader.setGold(100)
  escrow = new Escrow([
    new EscrowParticipant(trader.get()),
    new EscrowParticipant(requester.get())])
  const escrowService = app.get<EscrowService>(Types.EscrowService)
  escrowService.addEscrow(escrow)
})

async function approve() {
  await testRunner.invokeActionAs(requester.get(), RequestType.TradeApprove, input)
  await testRunner.invokeActionAs(trader.get(), RequestType.TradeApprove, input)
}

describe("trade approve action", () => {
  it("generates accurate messages", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.TradeApprove, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you approve this trade.")
    expect(response.getMessageToTarget()).toBe(`${requester.getMobName()} approves this trade.`)
    expect(response.getMessageToObservers()).toBe(`${requester.getMobName()} approves this trade.`)
  })

  it("resolves escrow when both parties approve", async () => {
    // when
    await approve()

    // then
    expect(escrow.isResolved()).toBeTruthy()
  })

  it("transfers escrow from requester when resolved", async () => {
    // given
    escrow.addGoldForMob(requester.get(), 15)
    escrow.addItemForMob(requester.get(), helm)

    // when
    await approve()

    // then
    expect(requester.getItems()).toHaveLength(0)
    expect(requester.getGold()).toBe(85)
  })

  it("transfers escrow from trader when resolved", async () => {
    // given
    escrow.addGoldForMob(trader.get(), 15)
    escrow.addItemForMob(trader.get(), shield)

    // when
    await approve()

    // then
    expect(trader.getItems()).toHaveLength(0)
    expect(trader.getGold()).toBe(85)
  })

  it("modifying the trade resets approvals", async () => {
    // setup
    escrow.addItemForMob(trader.get(), shield)
    escrow.approveForMob(trader.get())
    escrow.addGoldForMob(trader.get(), 1)

    // when
    escrow.approveForMob(requester.get())

    // then
    expect(escrow.isResolved()).toBeFalsy()
  })
})
