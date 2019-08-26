import {InventoryEntity} from "../../item/entity/inventoryEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {createInventory} from "../../item/factory/inventoryFactory"
import {MobEntity} from "../entity/mobEntity"
import {EscrowStatus} from "./escrowStatus"

export default class Escrow {
  private requesterGold = 0
  private readonly requesterInventory = createInventory()
  private traderGold = 0
  private readonly traderInventory = createInventory()
  private requesterAccepted = false
  private traderAccepted = false
  private escrowStatus: EscrowStatus = EscrowStatus.Live

  constructor(
    private readonly requester: MobEntity,
    private readonly trader: MobEntity) {}

  public approveForMob(mob: MobEntity) {
    if (this.requester.is(mob)) {
      this.requesterAccept()
      return
    } else if (this.trader.is(mob)) {
      this.traderAccept()
      return
    }

    throw new Error("mob cannot approve trade")
  }

  public addItemForMob(mob: MobEntity, item: ItemEntity) {
    if (this.requester.is(mob)) {
      this.addItemForRequester(item)
      return
    } else if (this.trader.is(mob)) {
      this.addItemForTrader(item)
      return
    }

    throw new Error("mob cannot add item to trade")
  }

  public addGoldForMob(mob: MobEntity, gold: number) {
    if (this.requester.is(mob)) {
      this.addGoldForRequester(gold)
      return
    } else if (this.trader.is(mob)) {
      this.addGoldForTrader(gold)
      return
    }

    throw new Error("mob cannot add gold to trade")
  }

  public addItemForRequester(item: ItemEntity) {
    if (this.escrowStatus !== EscrowStatus.Live) {
      throw new Error()
    }
    this.requesterInventory.addItem(item)
  }

  public addItemForTrader(item: ItemEntity) {
    if (this.escrowStatus !== EscrowStatus.Live) {
      throw new Error()
    }
    this.traderInventory.addItem(item)
  }

  public addGoldForRequester(amount: number) {
    if (this.escrowStatus !== EscrowStatus.Live) {
      throw new Error()
    }
    if (this.requester.gold < amount) {
      throw new Error()
    }
    this.requesterGold += amount
    this.requester.gold -= amount
  }

  public addGoldForTrader(amount: number) {
    if (this.escrowStatus !== EscrowStatus.Live) {
      throw new Error()
    }
    if (this.trader.gold < amount) {
      throw new Error()
    }
    this.traderGold += amount
    this.trader.gold -= amount
  }

  public requesterAccept() {
    this.requesterAccepted = true
    if (this.isReadyToResolve()) {
      this.accept()
    }
  }

  public traderAccept() {
    this.traderAccepted = true
    if (this.isReadyToResolve()) {
      this.accept()
    }
  }

  public resolveTrade() {
    if (this.requesterAccepted && this.traderAccepted) {
      this.accept()
      return
    }

    this.reject()
  }

  public isParticipant(mob: MobEntity) {
    return this.requester === mob || this.trader === mob
  }

  public isResolved() {
    return this.escrowStatus === EscrowStatus.Confirmed
  }

  private accept() {
    this.escrowStatus = EscrowStatus.Confirmed
    this.giveTo(this.requester, this.traderGold, this.traderInventory)
    this.giveTo(this.trader, this.requesterGold, this.requesterInventory)
  }

  private reject() {
    this.escrowStatus = EscrowStatus.Cancelled
    this.giveTo(this.requester, this.requesterGold, this.requesterInventory)
    this.giveTo(this.trader, this.traderGold, this.traderInventory)
  }

  private giveTo(mob: MobEntity, gold: number, inventory: InventoryEntity) {
    mob.gold += gold
    inventory.items.forEach(item => mob.inventory.addItem(item))
  }

  private isReadyToResolve() {
    return this.escrowStatus === EscrowStatus.Live && this.traderAccepted && this.requesterAccepted
  }
}
