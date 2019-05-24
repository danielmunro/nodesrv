import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/factory"
import {Item} from "../../item/model/item"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Furniture, name, description)
  item.isTransferable = false

  return item
}
