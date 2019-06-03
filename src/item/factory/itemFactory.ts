import {newEmptyAttributes} from "../../attributes/factory/attributeFactory"
import BuilderDefinition, {ItemFactory} from "../../import/builderDefinition"
import {ItemType as ImportItemType} from "../../import/enum/itemType"
import {DamageType} from "../../mob/fight/enum/damageType"
import {Mob} from "../../mob/model/mob"
import {Room} from "../../room/model/room"
import {Equipment} from "../enum/equipment"
import {ItemType} from "../enum/itemType"
import {Liquid} from "../enum/liquid"
import {WeaponType} from "../enum/weaponType"
import Container from "../model/container"
import Drink from "../model/drink"
import {Item} from "../model/item"
import {ItemContainerReset} from "../model/itemContainerReset"
import ItemMobReset from "../model/itemMobReset"
import {ItemRoomReset} from "../model/itemRoomReset"
import {MobEquipReset} from "../model/mobEquipReset"
import Weapon from "../model/weapon"
import {createInventory} from "./inventoryFactory"

export function newItemRoomReset(
  item: Item,
  room: Room,
  maxQuantity: number,
  maxPerRoom: number): ItemRoomReset {
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
  maxQuantity: number,
  maxPerRoom: number): ItemMobReset {
  const itemReset = new ItemMobReset()
  itemReset.item = item
  itemReset.mob = mob
  itemReset.maxQuantity = maxQuantity
  itemReset.maxPerRoom = maxPerRoom

  return itemReset
}

export function newMobEquipReset(item: Item, mob: Mob, maxQuantity: number, maxPerRoom: number) {
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
  const item = createItem()
  item.itemType = itemType
  item.name = name
  item.description = description
  item.level = level
  item.affects = []

  return item
}

export function createItem(): Item {
  const item = new Item()
  item.affects = []
  item.attributes = newEmptyAttributes()
  return item
}

export function newWeapon(name: string, description: string, weaponType: WeaponType, damageType: DamageType): Item {
  const weapon = createWeapon()
  weapon.name = name
  weapon.description = description
  weapon.itemType = ItemType.Equipment
  weapon.equipment = Equipment.Weapon
  weapon.weaponType = weaponType
  weapon.damageType = damageType
  weapon.level = 1

  return weapon
}

export function createWeapon(): Weapon {
  const weapon = new Weapon()
  weapon.affects = []
  weapon.attributes = newEmptyAttributes()
  return weapon
}

export function createDrink(): Drink {
  const drink = new Drink()
  drink.liquid = Liquid.Water
  return drink
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
  item.container = createContainer()
  item.container.weightCapacity = weightCapacity
  item.container.itemCapacity = itemCapacity

  return item
}

export function createContainer(): Container {
  const container = new Container()
  container.inventory = createInventory()
  return container
}

export function newTrash(name: string, description: string) {
  return newItem(ItemType.Trash, name, description)
}

export function createBuilderDefinition(itemType: ImportItemType, itemFactory: ItemFactory): BuilderDefinition {
  return { itemType, itemFactory }
}