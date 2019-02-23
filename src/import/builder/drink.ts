import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {ItemType} from "../../item/itemType"
import Drink from "../../item/model/drink"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"
import {liquidMap} from "../map/liquidMap"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const drink = newItem(ItemType.Drink, name, description)
  drink.drink = new Drink()
  drink.drink.foodAmount = +args[0]
  drink.drink.drinkAmount = +args[1]
  drink.drink.capacity = +args[1]
  drink.drink.liquid = liquidMap[args[2]]
  ItemBuilder.applyPoisonIfFlagged(drink, args[3])
  return drink
}
