import Attributes from "../attributes/model/attributes"
import { Equipment } from "./equipment"
import { Item } from "./model/item"
import { ItemType } from "./itemType"

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
  item.itemType = ItemType.Equipment

  return item
}

export function newFood(name: string, description: string, nourishment: number): Item {
  const item = new Item()
  item.name = name
  item.description = description
  item.nourishment = nourishment
  item.itemType = ItemType.Food

  return item
}

export function copy(item: Item): Item {
  const newItem = new Item()
  newItem.name = item.name
  newItem.description = item.description
  newItem.equipment = item.equipment
  newItem.itemType = item.itemType
  newItem.attributes = new Attributes().combine(item.attributes)

  return newItem
}
