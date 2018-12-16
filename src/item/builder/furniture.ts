import {newItem} from "../factory"
import ItemPrototype from "../itemPrototype"
import {ItemType} from "../itemType"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Furniture, name, description)
  item.isTransferable = false

  return item
}
