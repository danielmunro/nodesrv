import Attributes from "../attributes/model/attributes"
import { DamageType } from "../damage/damageType"
import { Equipment } from "./equipment"
import { ItemType } from "./itemType"
import { Inventory } from "./model/inventory"
import { Item } from "./model/item"
import Weapon from "./model/weapon"
import { WeaponType } from "./weaponType"

export function newWeapon(name: string, description: string, weaponType: WeaponType, damageType: DamageType): Item {
  const weapon = new Weapon()
  weapon.name = name
  weapon.description = description
  weapon.itemType = ItemType.Equipment
  weapon.equipment = Equipment.Weapon
  weapon.weaponType = weaponType
  weapon.damageType = damageType
  weapon.level = 1

  return weapon
}

export function newShield(name: string, description: string): Item {
  return newEquipment(name, description, Equipment.Shield)
}

function newItem(name: string, description: string): Item {
  const item = new Item()
  item.level = 1
  item.name = name
  item.description = description

  return item
}

export function newEquipment(name: string, description: string, equipment: Equipment): Item {
  const item = newItem(name, description)
  item.equipment = equipment
  item.itemType = ItemType.Equipment

  return item
}

export function newFood(name: string, description: string, nourishment: number = 1): Item {
  const item = newItem(name, description)
  item.nourishment = nourishment
  item.itemType = ItemType.Food

  return item
}

export function newItemFixture(name: string, description: string): Item {
  const item = newItem(name, description)
  item.isTransferable = false
  item.itemType = ItemType.Fixture

  return item
}

export function newContainer(name: string, description: string): Item {
  const item = newItem(name, description)
  item.containerInventory = new Inventory()
  item.itemType = ItemType.Container

  return item
}

export function copy(item: Item): Item {
  const itemCopy = newItem(item.name, item.description)
  itemCopy.equipment = item.equipment
  itemCopy.itemType = item.itemType
  itemCopy.attributes = new Attributes().combine(item.attributes)

  return itemCopy
}
