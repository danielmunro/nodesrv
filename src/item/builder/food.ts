import {newItem} from "../factory"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "../itemPrototype"
import {ItemType} from "../itemType"
import Food from "../model/food"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const food = newItem(ItemType.Food, name, description)
  food.food = new Food()
  food.food.foodAmount = +args[0]
  food.food.drinkAmount = +args[1]
  ItemBuilder.applyPoisonIfFlagged(food, args[3])
  return food
}
