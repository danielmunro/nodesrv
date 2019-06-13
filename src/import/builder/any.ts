import {ItemEntity} from "../../item/entity/itemEntity"
import {newItem} from "../../item/factory/itemFactory"
import {itemTypeMap} from "../map/itemTypeMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { type, name, description } = itemPrototype
  return newItem(itemTypeMap.find(typeMap => typeMap.import === type).type, name, description)
}
