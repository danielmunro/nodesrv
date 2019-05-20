import AffectBuilder from "../affect/affectBuilder"
import { AffectType } from "../affect/enum/affectType"
import BuilderDefinition from "../item/builderDefinition"
import {createBuilderDefinition} from "../item/factory"
import { Item } from "../item/model/item"
import any from "./builder/any"
import armor from "./builder/armor"
import container from "./builder/container"
import drink from "./builder/drink"
import food from "./builder/food"
import forge from "./builder/forge"
import fountain from "./builder/fountain"
import furniture from "./builder/furniture"
import light from "./builder/light"
import staff from "./builder/staff"
import wand from "./builder/wand"
import weapon from "./builder/weapon"
import { ItemType as ImportItemType } from "./enum/itemType"
import { itemAffectMap } from "./map/itemAffectMap"

export default class ItemBuilder {
  public static new(): ItemBuilder {
    return new ItemBuilder([
      // weapons
      createBuilderDefinition(ImportItemType.Weapon, weapon),
      createBuilderDefinition(ImportItemType.Wand, wand),
      createBuilderDefinition(ImportItemType.Staff, staff),

      // equipment
      createBuilderDefinition(ImportItemType.Armor, armor),
      createBuilderDefinition(ImportItemType.Clothing, armor),
      createBuilderDefinition(ImportItemType.Light, light),
      createBuilderDefinition(ImportItemType.Container, container),

      // consumables
      createBuilderDefinition(ImportItemType.Drink, drink),
      createBuilderDefinition(ImportItemType.Food, food),
      createBuilderDefinition(ImportItemType.Fountain, fountain),

      // fixtures
      createBuilderDefinition(ImportItemType.Forge, forge),
      createBuilderDefinition(ImportItemType.Furniture, furniture),
    ])
  }

  public static applyPoisonIfFlagged(item: Item, flag: string) {
    if (flag !== "0") {
      item.affects.push(new AffectBuilder(AffectType.Poison).build())
    }

    return item
  }

  private static setItemAffects(item: Item, flags: string[]) {
    for (const flag of flags) {
      if (itemAffectMap[flag]) {
        item.affects.push(new AffectBuilder(itemAffectMap[flag]).build())
      }
    }

    return item
  }

  private static addPropertiesToItem(item: Item, itemData: any) {
    item.level = itemData.level
    item.value = itemData.cost
    item.weight = itemData.weight
    item.material = itemData.material
    item.canonicalId = itemData.id
    item.brief = itemData.brief
    if (itemData.extraFlag && itemData.extraFlag !== "0") {
      ItemBuilder.setItemAffects(item, itemData.extraFlag.split(""))
    }
    if (item.name === "pit") {
      item.isTransferable = false
    }

    return item
  }

  private static splitPObjFlags(flags: string) {
    let buf = ""
    const length = flags.length
    let cursor = 0
    const values = []
    let quoting = false
    while (cursor < length) {
      if (flags[cursor] === "'") {
        quoting = !quoting
      } else if (flags[cursor] === " " && !quoting) {
        values.push(buf)
        buf = ""
      } else {
        buf += flags[cursor]
      }

      cursor++
    }
    if (buf) {
      values.push(buf)
    }
    return values
  }

  constructor(private readonly builders: BuilderDefinition[] = []) {}

  public async createItemFromImportData(itemData: any): Promise<Item> {
    const args = itemData.pObjFlags ? ItemBuilder.splitPObjFlags(itemData.pObjFlags) : []
    const { name, description, type } = itemData
    const prototype = { type, name, description, args }
    const builder = this.builders.find(b => b.itemType === type)
    const flags = args[1] !== undefined ? args[1].split("") : []
    if (builder) {
      return ItemBuilder.setItemAffects(
        ItemBuilder.addPropertiesToItem(builder.itemFactory(prototype), itemData), flags)
    }
    return ItemBuilder.setItemAffects(ItemBuilder.addPropertiesToItem(any(prototype), itemData), flags)
  }
}
