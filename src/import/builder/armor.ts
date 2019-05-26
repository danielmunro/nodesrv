import {newEquipment} from "../../item/factory/itemFactory"
import {Item} from "../../item/model/item"
import {equipmentMap} from "../map/equipmentMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newEquipment(name, description, equipmentMap[args[0]])
}
