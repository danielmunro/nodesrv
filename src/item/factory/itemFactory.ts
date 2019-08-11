import {newEmptyAttributes} from "../../attributes/factory/attributeFactory"
import BuilderDefinition, {ItemFactory} from "../../import/builderDefinition"
import {ItemType as ImportItemType} from "../../import/enum/itemType"
import {MobEntity} from "../../mob/entity/mobEntity"
import {DamageType} from "../../mob/fight/enum/damageType"
import {RoomEntity} from "../../room/entity/roomEntity"
import ContainerEntity from "../entity/containerEntity"
import DrinkEntity from "../entity/drinkEntity"
import {ItemContainerResetEntity} from "../entity/itemContainerResetEntity"
import {ItemEntity} from "../entity/itemEntity"
import ItemMobResetEntity from "../entity/itemMobResetEntity"
import {ItemRoomResetEntity} from "../entity/itemRoomResetEntity"
import {MobEquipResetEntity} from "../entity/mobEquipResetEntity"
import {Equipment} from "../enum/equipment"
import {ItemType} from "../enum/itemType"
import {Liquid} from "../enum/liquid"
import {WeaponType} from "../enum/weaponType"
import {createInventory} from "./inventoryFactory"

export function newItemRoomReset(
  item: ItemEntity,
  room: RoomEntity,
  maxQuantity: number,
  maxPerRoom: number): ItemRoomResetEntity {
  const itemReset = new ItemRoomResetEntity()
  itemReset.item = item
  itemReset.room = room
  itemReset.maxQuantity = maxQuantity
  itemReset.maxPerRoom = maxPerRoom

  return itemReset
}

export function newItemMobReset(
  item: ItemEntity,
  mob: MobEntity,
  maxQuantity: number,
  maxPerRoom: number): ItemMobResetEntity {
  const itemReset = new ItemMobResetEntity()
  itemReset.item = item
  itemReset.mob = mob
  itemReset.maxQuantity = maxQuantity
  itemReset.maxPerRoom = maxPerRoom

  return itemReset
}

export function newMobEquipReset(item: ItemEntity, mob: MobEntity, maxQuantity: number, maxPerRoom: number) {
  const equipMobReset = new MobEquipResetEntity()
  equipMobReset.item = item
  equipMobReset.mob = mob
  equipMobReset.maxQuantity = maxQuantity
  equipMobReset.maxPerRoom = maxPerRoom

  return equipMobReset
}

export function newItemContainerReset(itemSource: ItemEntity, itemDestination: ItemEntity) {
  const itemContainerReset = new ItemContainerResetEntity()
  itemContainerReset.item = itemSource
  itemContainerReset.itemDestination = itemDestination
  itemContainerReset.maxQuantity = 1
  itemContainerReset.maxPerRoom = 1

  return itemContainerReset
}

export function newItem(itemType: ItemType, name: string, description: string, level: number = 1): ItemEntity {
  const item = createItem()
  item.itemType = itemType
  item.name = name
  item.brief = name
  item.description = description
  item.level = level
  item.affects = []

  return item
}

export function createItem(): ItemEntity {
  const item = new ItemEntity()
  item.affects = []
  item.attributes = newEmptyAttributes()
  return item
}

export function newWeapon(
  name: string, description: string, weaponType: WeaponType, damageType: DamageType): ItemEntity {
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

export function createWeapon(): ItemEntity {
  const weapon = new ItemEntity()
  weapon.affects = []
  weapon.weaponEffects = []
  weapon.attributes = newEmptyAttributes()
  return weapon
}

export function createDrink(): DrinkEntity {
  const drink = new DrinkEntity()
  drink.drinkAmount = 1
  drink.liquid = Liquid.Water
  return drink
}

export function newEquipment(name: string, description: string, equipment: Equipment): ItemEntity {
  const item = newItem(ItemType.Equipment, name, description)
  item.equipment = equipment

  return item
}

export function newFood(name: string, description: string, nourishment: number = 1): ItemEntity {
  const item = newItem(ItemType.Food, name, description)
  item.hunger = nourishment

  return item
}

export function newContainer(
  name: string,
  description: string,
  weightCapacity: number = 0,
  itemCapacity: number = 0): ItemEntity {
  const item = newItem(ItemType.Container, name, description)
  item.container = createContainer()
  item.container.weightCapacity = weightCapacity
  item.container.itemCapacity = itemCapacity

  return item
}

export function createContainer(): ContainerEntity {
  const container = new ContainerEntity()
  container.inventory = createInventory()
  return container
}

export function newTrash(name: string, description: string) {
  return newItem(ItemType.Trash, name, description)
}

export function createBuilderDefinition(itemType: ImportItemType, itemFactory: ItemFactory): BuilderDefinition {
  return { itemType, itemFactory }
}
