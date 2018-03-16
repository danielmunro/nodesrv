import { Equipment } from "./equipment"
import { Item } from "./model/item"

export function newWeapon(name: string, description: string): Item {
  const item = new Item()
  item.name = name
  item.description = description
  item.equipment = Equipment.Weapon

  return item
}
