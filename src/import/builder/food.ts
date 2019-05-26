import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/itemFactory"
import Food from "../../item/model/food"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const food = newItem(ItemType.Food, name, description)
  food.food = new Food()
  food.food.foodAmount = +args[0]
  food.food.drinkAmount = +args[1]
  ItemBuilder.applyPoisonIfFlagged(food, args[3])
  return food
}
