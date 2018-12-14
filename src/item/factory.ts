import { AffectType } from "../affect/affectType"
import { newAffect } from "../affect/factory"
import Attributes from "../attributes/model/attributes"
import { DamageType } from "../damage/damageType"
import { Mob } from "../mob/model/mob"
import { Room } from "../room/model/room"
import { Equipment } from "./equipment"
import { ItemType } from "./itemType"
import Container from "./model/container"
import { Item } from "./model/item"
import { ItemContainerReset } from "./model/itemContainerReset"
import ItemMobReset from "./model/itemMobReset"
import { ItemRoomReset } from "./model/itemRoomReset"
import { MobEquipReset } from "./model/mobEquipReset"
import Weapon from "./model/weapon"
import { WeaponType } from "./weaponType"

export function newItemRoomReset(
  item: Item,
  room: Room,
  maxQuantity,
  maxPerRoom): ItemRoomReset {
  const itemReset = new ItemRoomReset()
  itemReset.item = item
  itemReset.room = room
  itemReset.maxQuantity = maxQuantity
  itemReset.maxPerRoom = maxPerRoom

  return itemReset
}

export function newItemMobReset(
  item: Item,
  mob: Mob,
  maxQuantity,
  maxPerRoom): ItemMobReset {
  const itemReset = new ItemMobReset()
  itemReset.item = item
  itemReset.mob = mob
  itemReset.maxQuantity = maxQuantity
  itemReset.maxPerRoom = maxPerRoom

  return itemReset
}

export function newMobEquipReset(item: Item, mob: Mob, maxQuantity, maxPerRoom) {
  const equipMobReset = new MobEquipReset()
  equipMobReset.item = item
  equipMobReset.mob = mob
  equipMobReset.maxQuantity = maxQuantity
  equipMobReset.maxPerRoom = maxPerRoom

  return equipMobReset
}

export function newItemContainerReset(itemSource: Item, itemDestination: Item) {
  const itemContainerReset = new ItemContainerReset()
  itemContainerReset.item = itemSource
  itemContainerReset.itemDestination = itemDestination
  itemContainerReset.maxQuantity = 1
  itemContainerReset.maxPerRoom = 1

  return itemContainerReset
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
  const item = newItem(ItemType.Equipment, name, description)
  item.equipment = equipment

  return item
}

export function newFood(name: string, description: string, nourishment: number = 1): Item {
  const item = newItem(ItemType.Food, name, description)
  item.hunger = nourishment

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
