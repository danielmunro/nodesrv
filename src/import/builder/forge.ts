import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import Forge from "../../item/model/forge"
import {Item} from "../../item/model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Forge, name, description)
  item.isTransferable = false
  item.forge = new Forge()

  return item
}
