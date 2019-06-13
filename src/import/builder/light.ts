import {ItemEntity} from "../../item/entity/itemEntity"
import {Equipment} from "../../item/enum/equipment"
import {newEquipment} from "../../item/factory/itemFactory"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  const light = newEquipment(name, description, Equipment.Held)
  light.wearTimer = +args[2]
  return light
}
