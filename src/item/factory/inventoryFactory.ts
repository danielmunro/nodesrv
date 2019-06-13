import {InventoryEntity} from "../entity/inventoryEntity"

export function createInventory(): InventoryEntity {
  const inventory = new InventoryEntity()
  inventory.items = []
  return inventory
}
