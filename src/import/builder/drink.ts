import {ItemType} from "../../item/enum/itemType"
import {createDrink, newItem} from "../../item/factory/itemFactory"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const drink = newItem(ItemType.Drink, name, description)
  drink.drink = createDrink()
  drink.drink.foodAmount = +args[0]
  drink.drink.drinkAmount = +args[1]
  drink.drink.capacity = +args[1]
  drink.drink.liquid = args[2]
  ItemBuilder.applyPoisonIfFlagged(drink, args[3])
  return drink
}
