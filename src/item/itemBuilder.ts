import { AffectType } from "../affect/affectType"
import { newPermanentAffect } from "../affect/factory"
import { DamageType } from "../damage/damageType"
import { ItemType as ImportItemType } from "../import/enum/itemType"
import { flagMap } from "../import/map/affectMap"
import BuilderDefinition from "./builder/builderDefinition"
import ItemPrototype from "./builder/itemPrototype"
import { newContainer, newItem, newWeapon } from "./factory"
import { ItemType } from "./itemType"
import Drink from "./model/drink"
import Food from "./model/food"
import { Item } from "./model/item"
import { WeaponType } from "./weaponType"

export default class ItemBuilder {
  private static async createItem(itemType: ItemType, name, description, itemData) {
    const item = newItem(itemType, name, description)
    await ItemBuilder.addPropertiesToItem(item, itemData)
    return item
  }

  private static setItemAffects(item: Item, flags: string[]) {
    for (const flag of flags) {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    }
  }

  private static addPropertiesToItem(item: Item, itemData) {
    item.level = itemData.level
    item.value = itemData.cost
    item.weight = itemData.weight
    item.material = itemData.material
    item.importId = itemData.id
    if (itemData.extraFlag && itemData.extraFlag !== "0") {
      ItemBuilder.setItemAffects(item, itemData.extraFlag.split(""))
    }
    if (item.name === "pit") {
      item.isTransferable = false
    }

    return item
  }

  private static applyPoisonIfFlagged(item: Item, flag: string) {
    if (flag !== "0") {
      item.affects.push(newPermanentAffect(AffectType.Poison))
    }
  }

  constructor(
      private readonly builders: BuilderDefinition[] = [],
  ) {}

  public async createItemFromImportData(itemData): Promise<Item> {
    const args = itemData.pObjFlags ? itemData.pObjFlags.split(" ") : []
    const { name, description, type } = itemData
    const prototype = new ItemPrototype(type, name, description, args)
    const builder = this.builders.find(b => b.itemType === type)
    if (builder) {
      return ItemBuilder.addPropertiesToItem(builder.builder(prototype), itemData)
    }
    switch (type) {
      case ImportItemType.Container:
        const container = newContainer(name, description)
        container.container.weightCapacity = +args[0]
        container.container.liquid = args[2]
        container.container.maxWeightForItem = +args[3]
        const flags = args[1].split("")
        ItemBuilder.setItemAffects(container, flags)
        await ItemBuilder.addPropertiesToItem(container, itemData)
        return container
      case ImportItemType.Drink:
        const drink = newItem(ItemType.Drink, name, description)
        drink.drink = new Drink()
        drink.drink.foodAmount = +args[0]
        drink.drink.drinkAmount = +args[1]
        drink.drink.capacity = +args[1]
        drink.drink.liquid = args[2]
        await ItemBuilder.addPropertiesToItem(drink, itemData)
        ItemBuilder.applyPoisonIfFlagged(drink, args[3])
        return drink
      case ImportItemType.Food:
        const food = newItem(ItemType.Food, name, description)
        food.food = new Food()
        food.food.foodAmount = +args[0]
        food.food.drinkAmount = +args[1]
        await ItemBuilder.addPropertiesToItem(food, itemData)
        ItemBuilder.applyPoisonIfFlagged(food, args[3])
        return food
      case ImportItemType.Fountain:
        const fountain = newItem(ItemType.Fountain, name, description)
        fountain.drink = new Drink()
        fountain.drink.foodAmount = +args[0]
        fountain.drink.drinkAmount = +args[1]
        fountain.drink.liquid = args[2]
        fountain.isTransferable = false
        ItemBuilder.applyPoisonIfFlagged(fountain, args[3])
        return fountain
      case ImportItemType.Forge:
        const mageLab = newItem(ItemType.Forge, name, description)
        mageLab.isTransferable = false
        await ItemBuilder.addPropertiesToItem(mageLab, itemData)
        return mageLab
      case ImportItemType.Light:
        const light = newItem(ItemType.Light, name, description)
        light.wearTimer = args[2]
        await ItemBuilder.addPropertiesToItem(light, itemData)
        return light
      case ImportItemType.Map:
        return ItemBuilder.createItem(ItemType.Map, name, description, itemData)
      case ImportItemType.Trash:
        return ItemBuilder.createItem(ItemType.Trash, name, description, itemData)
      case ImportItemType.Gem:
        return ItemBuilder.createItem(ItemType.Gem, name, description, itemData)
      case ImportItemType.Key:
        return ItemBuilder.createItem(ItemType.Key, name, description, itemData)
      case ImportItemType.Wand:
        const wand = newWeapon(name, description, WeaponType.Wand, DamageType.Magic)
        await ItemBuilder.addPropertiesToItem(wand, itemData)
        return wand
      case ImportItemType.Furniture:
        const furniture = newItem(ItemType.Fixture, name, description)
        await ItemBuilder.addPropertiesToItem(furniture, itemData)
        return furniture
      case ImportItemType.Money:
        return ItemBuilder.createItem(ItemType.Money, name, description, itemData)
      case ImportItemType.Treasure:
        return ItemBuilder.createItem(ItemType.Treasure, name, description, itemData)
      case ImportItemType.Potion:
        return ItemBuilder.createItem(ItemType.Potion, name, description, itemData)
      case ImportItemType.Scroll:
        return ItemBuilder.createItem(ItemType.Scroll, name, description, itemData)
      case ImportItemType.SpellPage:
        return ItemBuilder.createItem(ItemType.SpellPage, name, description, itemData)
      case ImportItemType.ItemPart:
        return ItemBuilder.createItem(ItemType.ItemPart, name, description, itemData)
      case ImportItemType.Boat:
        return ItemBuilder.createItem(ItemType.Boat, name, description, itemData)
      case ImportItemType.Grenade:
        return ItemBuilder.createItem(ItemType.Grenade, name, description, itemData)
      case ImportItemType.Jukebox:
        return ItemBuilder.createItem(ItemType.Jukebox, name, description, itemData)
      case ImportItemType.TrapPart:
        return ItemBuilder.createItem(ItemType.Boat, name, description, itemData)
      case ImportItemType.Jewelry:
        return ItemBuilder.createItem(ItemType.Jewelry, name, description, itemData)
      case ImportItemType.Pill:
        return ItemBuilder.createItem(ItemType.Pill, name, description, itemData)
      case ImportItemType.WarpStone:
        return ItemBuilder.createItem(ItemType.WarpStone, name, description, itemData)
      case ImportItemType.Portal:
        return ItemBuilder.createItem(ItemType.Portal, name, description, itemData)
      case ImportItemType.None:
        return ItemBuilder.createItem(ItemType.None, name, description, itemData)
      case ImportItemType.RoomKey:
        return ItemBuilder.createItem(ItemType.Key, name, description, itemData)
      case ImportItemType.NpcCorpse:
        return ItemBuilder.createItem(ItemType.Corpse, name, description, itemData)
      case ImportItemType.PcCorpse:
        return ItemBuilder.createItem(ItemType.Corpse, name, description, itemData)
      case ImportItemType.Staff:
        const staff = newWeapon(name, description, WeaponType.Stave, DamageType.Magic)
        await ItemBuilder.addPropertiesToItem(staff, itemData)
        return staff
      default:
        return
    }
  }
}
