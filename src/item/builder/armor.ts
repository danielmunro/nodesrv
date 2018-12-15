import {equipmentMap} from "../../import/map/equipmentMap"
import {newEquipment} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newEquipment(name, description, equipmentMap[args[0]])
}
