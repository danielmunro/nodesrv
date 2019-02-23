import {newContainer} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"
import {liquidMap} from "../map/liquidMap"

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
