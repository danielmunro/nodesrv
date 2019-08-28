import {InventoryEntity} from "../../item/entity/inventoryEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {createInventory} from "../../item/factory/inventoryFactory"
import {MobEntity} from "../entity/mobEntity"

export default class EscrowParticipant {
  private readonly inventory: InventoryEntity = createInventory()
  private gold: number = 0
  private approved: boolean = false

  constructor(private readonly mob: MobEntity) {}

  public getGold() {
    return this.gold
  }

  public getInventory() {
    return this.inventory
  }

  public collectFrom(participant: EscrowParticipant) {
    this.mob.gold += participant.getGold()
    participant.getInventory().items.forEach(item => this.mob.inventory.addItem(item))
  }

  public addItem(item: ItemEntity) {
    this.inventory.addItem(item)
  }

  public addGold(gold: number) {
    if (this.mob.gold < gold) {
      throw new Error("not enough gold")
    }
    this.gold += gold
    this.mob.gold -= gold
  }

  public approve() {
    this.approved = true
  }

  public resetApproval() {
    this.approved = false
  }

  public isApproved() {
    return this.approved
  }

  public isMob(mob: MobEntity) {
    return this.mob.is(mob)
  }
}
