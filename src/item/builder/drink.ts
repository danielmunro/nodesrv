import {liquidMap} from "../../import/map/liquidMap"
import {newItem} from "../factory"
import ItemPrototype from "../itemPrototype"
import {ItemType} from "../itemType"
import Drink from "../model/drink"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const drink = newItem(ItemType.Drink, name, description)
  drink.drink = new Drink()
  drink.drink.foodAmount = +args[0]
  drink.drink.drinkAmount = +args[1]
  drink.drink.capacity = +args[1]
  drink.drink.liquid = liquidMap[args[2]]
  return drink
}
