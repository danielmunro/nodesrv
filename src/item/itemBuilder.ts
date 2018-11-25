import { ItemType as ImportItemType } from "../import/enum/itemType"
import { newContainer, newEquipment, newFood, newItem, newItemFixture, newWeapon } from "./factory"
import { Item } from "./model/item"
import { flagMap } from "../import/affectMap"
import { newAffect, newPermanentAffect } from "../affect/factory"
import { ItemType } from "./itemType"
import { AffectType } from "../affect/affectType"

export default class ItemBuilder {
  private static async addPropertiesToItem(item: Item, itemData) {
    item.level = itemData.level
    item.value = itemData.cost
    item.weight = itemData.weight
    item.material = itemData.material
    item.importId = itemData.id
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
        this.setItemAffects(container, flags)
        await ItemBuilder.addPropertiesToItem(container, itemData)
        return container
      case ImportItemType.Drink:
        const drink = newItem(ItemType.Drink, name, description)
        drink.hunger = args[0]
        drink.thirst = args[1]
        drink.drink = args[2]
        await ItemBuilder.addPropertiesToItem(drink, itemData)
        if (args[3] !== "0") {
          drink.affects.push(newAffect(AffectType.Poison))
        }
        return drink
      case ImportItemType.Food:
        const food = newItem(ItemType.Food, name, description)
        food.hunger = args[0]
        food.thirst = args[1]
        await ItemBuilder.addPropertiesToItem(food, itemData)
        if (args[3] !== "0") {
          food.affects.push(newAffect(AffectType.Poison))
        }
        return food
      case ImportItemType.Fountain:
        const fountain = newItem(ItemType.Fountain, name, description)
        fountain.drink = args[2]
        fountain.isTransferable = false
        if (args[3] !== "0") {
          fountain.affects.push(newAffect(AffectType.Poison))
        }
        return fountain
      default:
        return
    }
  }

  private setItemAffects(item: Item, flags: string[]) {
    flags.forEach(flag => {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    })
  }
}
