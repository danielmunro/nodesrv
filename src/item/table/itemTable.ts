import collectionSearch from "../../support/matcher/collectionSearch"
import { InventoryEntity } from "../entity/inventoryEntity"
import { ItemEntity } from "../entity/itemEntity"

export default class ItemTable {
  constructor(public items: ItemEntity[] = []) {}

  public findByInventory(inventory: InventoryEntity): ItemEntity[] {
    return this.items.filter(i => inventory.items.includes(i))
  }

  public findItemByInventory(inventory: InventoryEntity, name: string): ItemEntity {
    return collectionSearch(
      this.items, name, (item: ItemEntity) => item.inventory.uuid === inventory.uuid)
  }

  public add(item: ItemEntity) {
    this.items.push(item)
  }

  public remove(item: ItemEntity) {
    const i = this.items.indexOf(item)
    this.items.splice(i, 1)
  }
}
