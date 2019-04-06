import {Equipment} from "../../item/enum/equipment"
import {newEquipment} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const light = newEquipment(name, description, Equipment.Held)
  light.wearTimer = +args[2]
  return light
}
