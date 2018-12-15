import {liquidMap} from "../../import/map/liquidMap"
import {newContainer} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const item = newContainer(name, description)
  item.container.weightCapacity = +args[0]
  if (args[2]) {
    item.container.liquid = liquidMap[args[2]]
  }
  item.container.maxWeightForItem = +args[3]
  return item
}
