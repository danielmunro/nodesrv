import { AffectType } from "../affect/affectType"
import { newPermanentAffect } from "../affect/factory"
import { flagMap } from "../import/affectMap"
import { ItemType as ImportItemType } from "../import/enum/itemType"
import { newContainer, newEquipment, newItem, newWeapon } from "./factory"
import { ItemType } from "./itemType"
import { Item } from "./model/item"

export default class ItemBuilder {
  private static setItemAffects(item: Item, flags: string[]) {
    for (const flag of flags) {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    }
  }

  private static async addPropertiesToItem(item: Item, itemData) {
    item.level = itemData.level
    item.value = itemData.cost
    item.weight = itemData.weight
    item.material = itemData.material
    item.importId = itemData.id
    if (itemData.extraFlag !== "0") {
      ItemBuilder.setItemAffects(item, itemData.extraFlag.split(""))
    }
    if (item.name === "pit") {
      item.isTransferable = false
    }
  }

  private static applyPoisonIfFlagged(item: Item, flag: string) {
    if (flag !== "0") {
      item.affects.push(newPermanentAffect(AffectType.Poison))
    }
  }

  public async createItemFromImportData(itemData) {
    const args = itemData.pObjFlags.split(" ")
    const { name, description } = itemData
    switch (itemData.type) {
      case ImportItemType.Weapon:
        const weapon = newWeapon(name, description, args[0], args[2])
        await ItemBuilder.addPropertiesToItem(weapon, itemData)
        return weapon
      case ImportItemType.Armor:
      case ImportItemType.Clothing:
        const armor = newEquipment(name, description, args[0])
        await ItemBuilder.addPropertiesToItem(armor, itemData)
        return armor
      case ImportItemType.Boat:
        break
      case ImportItemType.Container:
        const container = newContainer(name, description)
        container.container.weightCapacity = args[0]
        container.container.liquid = args[2]
        container.container.maxWeightForItem = args[3]
        const flags = args[1].split("")
        ItemBuilder.setItemAffects(container, flags)
        await ItemBuilder.addPropertiesToItem(container, itemData)
        return container
      case ImportItemType.Drink:
        const drink = newItem(ItemType.Drink, name, description)
        drink.hunger = args[0]
        drink.thirst = args[1]
        drink.drink = args[2]
        await ItemBuilder.addPropertiesToItem(drink, itemData)
        ItemBuilder.applyPoisonIfFlagged(drink, args[3])
        return drink
      case ImportItemType.Food:
        const food = newItem(ItemType.Food, name, description)
        food.hunger = args[0]
        food.thirst = args[1]
        await ItemBuilder.addPropertiesToItem(food, itemData)
        ItemBuilder.applyPoisonIfFlagged(food, args[3])
        return food
      case ImportItemType.Fountain:
        const fountain = newItem(ItemType.Fountain, name, description)
        fountain.drink = args[2]
        fountain.isTransferable = false
        ItemBuilder.applyPoisonIfFlagged(fountain, args[3])
        return fountain
      default:
        return
    }
  }
}
