import { Equipment } from "./equipment"
import { Item } from "./model/item"

export function newWeapon(name: string, description: string): Item {
  return newEquipment(name, description, Equipment.Weapon)
}

export function newShield(name: string, description: string): Item {
  return newEquipment(name, description, Equipment.Shield)
}

function newEquipment(name: string, description: string, equipment: Equipment): Item {
  const item = new Item()
  item.name = name
  item.description = description
  item.equipment = equipment

  return item
}
