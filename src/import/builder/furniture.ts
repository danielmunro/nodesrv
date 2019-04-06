import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {ItemType} from "../../item/enum/itemType"
import {Item} from "../../item/model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Furniture, name, description)
  item.isTransferable = false

  return item
}
