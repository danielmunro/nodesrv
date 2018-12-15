import {equipmentMap} from "../../import/map/equipmentMap"
import {newEquipment} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  return newEquipment(
    itemPrototype.name,
    itemPrototype.description,
    equipmentMap[itemPrototype.args[0]])
}
