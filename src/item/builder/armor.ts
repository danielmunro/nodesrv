import {equipmentMap} from "../../import/map/equipmentMap"
import {newEquipment} from "../factory"
import {Item} from "../model/item"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  return newEquipment(
      itemPrototype.name,
      itemPrototype.description,
      equipmentMap[itemPrototype.args[0]])
}
