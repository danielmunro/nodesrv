import {Inventory} from "../model/inventory"

export function createInventory(): Inventory {
  const inventory = new Inventory()
  inventory.items = []
  return inventory
}
