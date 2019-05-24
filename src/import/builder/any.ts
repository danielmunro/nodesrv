import {newItem} from "../../item/factory/factory"
import {Item} from "../../item/model/item"
import {itemTypeMap} from "../map/itemTypeMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { type, name, description } = itemPrototype
  return newItem(itemTypeMap.find(typeMap => typeMap.import === type).type, name, description)
}
