import { AffectType } from "../affect/affectType"
import { newPermanentAffect } from "../affect/factory"
import { ItemType as ImportItemType } from "../import/enum/itemType"
import { flagMap } from "../import/map/affectMap"
import any from "./builder/any"
import armor from "./builder/armor"
import container from "./builder/container"
import drink from "./builder/drink"
import food from "./builder/food"
import forge from "./builder/forge"
import fountain from "./builder/fountain"
import furniture from "./builder/furniture"
import light from "./builder/light"
import weapon from "./builder/weapon"
import BuilderDefinition from "./builderDefinition"
import ItemPrototype from "./itemPrototype"
import { Item } from "./model/item"
import wand from "./builder/wand"
import staff from "./builder/staff"

export default class ItemBuilder {
  public static new(): ItemBuilder {
    return new ItemBuilder([
      // weapons
      new BuilderDefinition(ImportItemType.Weapon, weapon),
      new BuilderDefinition(ImportItemType.Wand, wand),
      new BuilderDefinition(ImportItemType.Staff, staff),

      // equipment
      new BuilderDefinition(ImportItemType.Armor, armor),
      new BuilderDefinition(ImportItemType.Clothing, armor),
      new BuilderDefinition(ImportItemType.Light, light),
      new BuilderDefinition(ImportItemType.Container, container),

      // consumables
      new BuilderDefinition(ImportItemType.Drink, drink),
      new BuilderDefinition(ImportItemType.Food, food),
      new BuilderDefinition(ImportItemType.Fountain, fountain),

      // fixtures
      new BuilderDefinition(ImportItemType.Forge, forge),
      new BuilderDefinition(ImportItemType.Furniture, furniture),
    ])
  }

  public static applyPoisonIfFlagged(item: Item, flag: string) {
    if (flag !== "0") {
      item.affects.push(newPermanentAffect(AffectType.Poison))
    }

    return item
  }

  private static setItemAffects(item: Item, flags: string[]) {
    for (const flag of flags) {
      if (flagMap[flag]) {
        item.affects.push(newPermanentAffect(flagMap[flag]))
      }
    }

    return item
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

  constructor(
    private readonly builders: BuilderDefinition[] = [],
  ) {}

  public async createItemFromImportData(itemData): Promise<Item> {
    const args = itemData.pObjFlags ? ItemBuilder.splitPObjFlags(itemData.pObjFlags) : []
    const { name, description, type } = itemData
    const prototype = new ItemPrototype(type, name, description, args)
    const builder = this.builders.find(b => b.itemType === type)
    const flags = 1 in args ? args[1].split("") : []
    if (builder) {
      return ItemBuilder.setItemAffects(
        ItemBuilder.addPropertiesToItem(builder.buildItem(prototype), itemData), flags)
    }
    return ItemBuilder.setItemAffects(ItemBuilder.addPropertiesToItem(any(prototype), itemData), flags)
  }
}
