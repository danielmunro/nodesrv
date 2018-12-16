import {itemTypeMap} from "../../import/map/itemTypeMap"
import {newItem} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { type, name, description } = itemPrototype
  return newItem(itemTypeMap.find(typeMap => typeMap.import === type).type, name, description)
}
