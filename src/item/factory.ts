import { AffectType } from "../affect/affectType"
import { newAffect } from "../affect/factory"
import Attributes from "../attributes/model/attributes"
import { DamageType } from "../damage/damageType"
import { Equipment } from "./equipment"
import { ItemType } from "./itemType"
import Container from "./model/container"
import { Inventory } from "./model/inventory"
import { Item } from "./model/item"
import ItemReset from "./model/itemReset"
import Weapon from "./model/weapon"
import { WeaponType } from "./weaponType"

export function newItemReset(
  item: Item,
  inventory: Inventory,
  itemLimit: number = -1,
  equipmentPosition: Equipment = null): ItemReset {
  const itemReset = new ItemReset()
  itemReset.item = item
  itemReset.inventory = inventory
  itemReset.itemLimit = itemLimit
  itemReset.equipmentPosition = equipmentPosition

  return itemReset
}

export function newItem(itemType: ItemType, name: string, description: string, level: number = 1): Item {
  const item = new Item()
  item.itemType = itemType
  item.name = name
  item.description = description

  return item
}

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

export function newEquipment(name: string, description: string, equipment: Equipment): Item {
  return newItem(ItemType.Equipment, name, description)
}

export function newFood(name: string, description: string, nourishment: number = 1): Item {
  const item = newItem(ItemType.Food, name, description)
  item.hunger = nourishment

  return item
}

export function newItemFixture(name: string, description: string): Item {
  const item = newItem(ItemType.Fixture, name, description)
  item.isTransferable = false

  return item
}

export function newContainer(
  name: string,
  description: string,
  weightCapacity: number = 0,
  itemCapacity: number = 0): Item {
  const item = newItem(ItemType.Container, name, description)
  item.container = new Container()
  item.container.weightCapacity = weightCapacity
  item.container.itemCapacity = itemCapacity

  return item
}

export function newTrash(name: string, description: string) {
  return newItem(ItemType.Trash, name, description)
}

export function copy(item: Item): Item {
  const itemCopy = newItem(item.itemType, item.name, item.description, item.level)
  itemCopy.equipment = item.equipment
  itemCopy.itemType = item.itemType
  itemCopy.attributes = new Attributes().combine(item.attributes)
  itemCopy.value = item.value

  return itemCopy
}

export function poison(item: Item, timeout: number = -1): Item {
  item.affects.push(newAffect(AffectType.Poison, timeout))

  return item
}
