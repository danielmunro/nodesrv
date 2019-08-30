import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Escrow from "../../../../mob/trade/escrow"
import EscrowParticipant from "../../../../mob/trade/escrowParticipant"
import EscrowService from "../../../../mob/trade/service/escrowService"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let requester: MobBuilder
let trader: MobBuilder
let escrow: Escrow
let helm: ItemEntity
let shield: ItemEntity
const input = "trade reject"

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

async function reject() {
  return await testRunner.invokeActionAs(requester.get(), RequestType.TradeReject, input)
}

describe("trade reject action", () => {
  it("generates accurate messages", async () => {
    // when
    const response = await reject()

    // then
    expect(response.getMessageToRequestCreator()).toBe("you reject the trade.")
    expect(response.getMessageToTarget()).toBe(`${requester.getMobName()} rejects the trade.`)
    expect(response.getMessageToObservers()).toBe(`${requester.getMobName()} rejects the trade.`)
  })

  it("resolves escrow when both parties reject", async () => {
    // when
    await reject()

    // then
    expect(escrow.isResolved()).toBeTruthy()
  })

  it("transfers escrow back to requester when rejected", async () => {
    // given
    escrow.addGoldForMob(requester.get(), 15)
    escrow.addItemForMob(requester.get(), helm)

    // when
    await reject()

    // then
    expect(requester.getItems()).toHaveLength(1)
    expect(requester.getGold()).toBe(100)
  })

  it("transfers escrow back to trader when rejected", async () => {
    // given
    escrow.addGoldForMob(trader.get(), 15)
    escrow.addItemForMob(trader.get(), shield)

    // when
    await reject()

    // then
    expect(trader.getItems()).toHaveLength(1)
    expect(trader.getGold()).toBe(100)
  })
})
