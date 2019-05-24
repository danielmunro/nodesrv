import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/factory"
import Forge from "../../item/model/forge"
import {Item} from "../../item/model/item"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Forge, name, description)
  item.isTransferable = false
  item.forge = new Forge()

  return item
}
