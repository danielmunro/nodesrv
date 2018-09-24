import { Inventory } from "./model/inventory"
import { Item } from "./model/item"

export default class ItemTable {
  constructor(public items: Item[]) {}

  public findByInventory(inventory: Inventory): Item[] {
    return this.items.filter(i => i.inventory.id === inventory.id)
  }

  public add(item: Item) {
    this.items.push(item)
  }
}
