import {createInventory} from "../../item/factory/inventoryFactory"
import {Inventory} from "../../item/model/inventory"
import {Item} from "../../item/model/item"
import {Mob} from "../model/mob"
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
    private readonly requester: Mob,
    private readonly trader: Mob) {}

  public addItemForRequester(item: Item) {
    if (this.escrowStatus !== EscrowStatus.Live) {
      throw new Error()
    }
    this.requesterInventory.addItem(item)
  }

  public addItemForTrader(item: Item) {
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
  }

  public traderAccept() {
    this.traderAccepted = true
  }

  public resolveTrade() {
    if (this.requesterAccepted && this.traderAccepted) {
      this.accept()
      return
    }

    this.reject()
  }

  public isParticipant(mob: Mob) {
    return this.requester === mob || this.trader === mob
  }

  private accept() {
    this.requester.gold += this.traderGold
    this.requesterInventory.items.forEach(item => this.trader.inventory.addItem(item))
    this.trader.gold += this.requesterGold
    this.traderInventory.items.forEach(item => this.requester.inventory.addItem(item))
  }

  private reject() {
    this.requester.gold += this.requesterGold
    this.requesterInventory.items.forEach(item => this.requester.inventory.addItem(item))
    this.trader.gold += this.traderGold
    this.traderInventory.items.forEach(item => this.trader.inventory.addItem(item))
  }
}
