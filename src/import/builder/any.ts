import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"
import {itemTypeMap} from "../map/itemTypeMap"

export default function(itemPrototype: ItemPrototype): Item {
  const { type, name, description } = itemPrototype
  return newItem(itemTypeMap.find(typeMap => typeMap.import === type).type, name, description)
}
