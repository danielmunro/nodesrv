import DrinkEntity from "../../item/entity/drinkEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {newContainer} from "../../item/factory/itemFactory"
import {liquidMap} from "../map/liquidMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  const item = newContainer(name, description)
  item.container.weightCapacity = +args[0]
  if (args[2]) {
    item.drink = new DrinkEntity()
    item.drink.drinkAmount = 1
    // @ts-ignore
    item.drink.liquid = liquidMap[args[2]]
  }
  item.container.maxWeightForItem = +args[3]
  return item
}
