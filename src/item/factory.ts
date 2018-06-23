import Attributes from "../attributes/model/attributes"
import { Equipment } from "./equipment"
import { Item } from "./model/item"

export function newWeapon(name: string, description: string): Item {
  return newEquipment(name, description, Equipment.Weapon)
}

export function newShield(name: string, description: string): Item {
  return newEquipment(name, description, Equipment.Shield)
}

export function newEquipment(name: string, description: string, equipment: Equipment): Item {
  const item = new Item()
  item.name = name
  item.description = description
  item.equipment = equipment

  return item
}

export function copy(item: Item): Item {
  const newItem = new Item()
  newItem.name = item.name
  newItem.description = item.description
  newItem.equipment = item.equipment
  newItem.attributes = new Attributes().combine(item.attributes)

  return newItem
}
