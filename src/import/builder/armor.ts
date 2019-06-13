import {ItemEntity} from "../../item/entity/itemEntity"
import {newEquipment} from "../../item/factory/itemFactory"
import {equipmentMap} from "../map/equipmentMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  return newEquipment(name, description, equipmentMap[args[0]])
}
