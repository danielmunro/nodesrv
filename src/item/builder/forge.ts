import {newItem} from "../factory"
import ItemPrototype from "../itemPrototype"
import {ItemType} from "../itemType"
import Forge from "../model/forge"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  const item = newItem(ItemType.Forge, name, description)
  item.isTransferable = false
  item.forge = new Forge()

  return item
}
