import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {ItemType} from "../../item/enum/itemType"
import Food from "../../item/model/food"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const food = newItem(ItemType.Food, name, description)
  food.food = new Food()
  food.food.foodAmount = +args[0]
  food.food.drinkAmount = +args[1]
  ItemBuilder.applyPoisonIfFlagged(food, args[3])
  return food
}
