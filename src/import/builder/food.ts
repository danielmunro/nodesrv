import FoodEntity from "../../item/entity/foodEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/itemFactory"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  const food = newItem(ItemType.Food, name, description)
  food.food = new FoodEntity()
  food.food.foodAmount = +args[0]
  food.food.drinkAmount = +args[1]
  ItemBuilder.applyPoisonIfFlagged(food, args[3])
  return food
}
