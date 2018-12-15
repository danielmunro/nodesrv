import {Equipment} from "../equipment"
import {newEquipment} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const light = newEquipment(name, description, Equipment.Held)
  light.wearTimer = +args[2]
  return light
}
