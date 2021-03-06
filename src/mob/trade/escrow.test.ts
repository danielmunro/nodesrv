import {createTestAppContainer} from "../../app/factory/testFactory"
import {ItemEntity} from "../../item/entity/itemEntity"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Escrow from "./escrow"
import EscrowParticipant from "./escrowParticipant"

let testRunner: TestRunner
let requester: MobBuilder
let trader: MobBuilder
let escrow: Escrow
let item: ItemEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  requester = (await testRunner.createMob()).withGold(100)
  trader = await testRunner.createMob()
  escrow = new Escrow([new EscrowParticipant(requester.mob), new EscrowParticipant(trader.mob)])
  item = testRunner.createItem().asHelmet().addToMobBuilder(trader).build()
})

describe("escrow", () => {
  it("resolves a trade if both accepted", () => {
    // given
    escrow.addGoldForMob(requester.get(), 100)
    expect(requester.mob.gold).toBe(0)
    escrow.addItemForMob(trader.get(), item)

    // when
    escrow.approveForMob(requester.get())
    escrow.approveForMob(trader.get())

    // then
    expect(requester.mob.gold).toBe(0)
    expect(requester.mob.inventory.items).toHaveLength(1)
    expect(trader.mob.gold).toBe(100)
    expect(trader.mob.inventory.items).toHaveLength(0)
  })

  it("rejects a trade if not accepted when resolved", () => {
    // given
    escrow.addGoldForMob(requester.get(), 100)
    expect(requester.mob.gold).toBe(0)
    escrow.addItemForMob(trader.get(), item)

    // when
    escrow.resolveTrade()

    // then
    expect(requester.mob.gold).toBe(100)
    expect(requester.mob.inventory.items).toHaveLength(0)
    expect(trader.mob.gold).toBe(0)
    expect(trader.mob.inventory.items).toHaveLength(1)
  })

  it("requires two participants", async () => {
    expect(() => new Escrow([])).toThrowError()
    expect(() => new Escrow([
      new EscrowParticipant(requester.get()),
    ])).toThrowError()
    const thirdWheel = (await testRunner.createMob()).get()
    expect(() => new Escrow([
      new EscrowParticipant(requester.get()),
      new EscrowParticipant(trader.get()),
      new EscrowParticipant(thirdWheel),
    ])).toThrowError()
  })

  it("third wheels cannot modify escrows", async () => {
    // when
    const mob = (await testRunner.createMob())
      .setGold(10)
      .get()

    // then
    expect(() => escrow.addGoldForMob(mob, 10)).toThrowError()
  })

  it("cannot add gold that is not owned", async () => {
    // then
    expect(() => escrow.addGoldForMob(requester.get(), 10000)).toThrowError()
  })
})
