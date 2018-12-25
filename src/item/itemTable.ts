import collectionSearch from "../support/matcher/collectionSearch"
import { Inventory } from "./model/inventory"
import { Item } from "./model/item"

export default class ItemTable {
  constructor(public items: Item[] = []) {}

  public findByInventory(inventory: Inventory): Item[] {
    return this.items.filter(i => i.inventory.uuid === inventory.uuid)
  }

  public findItemByInventory(inventory: Inventory, name: string): Item {
    return collectionSearch(this.items, name, item => item.inventory.uuid === inventory.uuid)
  }

  public add(item: Item) {
    this.items.push(item)
  }

  public remove(item: Item) {
    const i = this.items.indexOf(item)
    this.items.splice(i, 1)
  }
}
