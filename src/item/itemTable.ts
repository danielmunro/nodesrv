import { Inventory } from "./model/inventory"
import { Item } from "./model/item"
import collectionSearch from "../support/matcher/collectionSearch"

export default class ItemTable {
  constructor(public items: Item[] = []) {}

  public findByInventory(inventory: Inventory): Item[] {
    return this.items.filter(i => i.inventory.id === inventory.id)
  }

  public findItemByInventory(inventory: Inventory, name: string): Item {
    return collectionSearch(this.items, name, item => item.inventory.id === inventory.id)
  }

  public add(item: Item) {
    this.items.push(item)
  }

  public remove(item: Item) {
    const i = this.items.indexOf(item)
    this.items.splice(i, 1)
  }
}
