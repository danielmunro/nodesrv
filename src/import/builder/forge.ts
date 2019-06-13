import ForgeEntity from "../../item/entity/forgeEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/itemFactory"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Forge, name, description)
  item.isTransferable = false
  item.forge = new ForgeEntity()
  item.forge.recipes = []

  return item
}
