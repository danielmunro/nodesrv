import {newEquipment} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"
import {equipmentMap} from "../map/equipmentMap"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newEquipment(name, description, equipmentMap[args[0]])
}
