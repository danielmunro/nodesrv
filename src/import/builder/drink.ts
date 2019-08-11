import {ItemEntity} from "../../item/entity/itemEntity"
import {ItemType} from "../../item/enum/itemType"
import {createDrink, newItem} from "../../item/factory/itemFactory"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "./itemPrototype"
import {Liquid} from "../../item/enum/liquid"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  const drink = newItem(ItemType.Drink, name, description)
  drink.drink = createDrink()
  drink.drink.foodAmount = +args[0]
  drink.drink.drinkAmount = +args[1]
  drink.drink.capacity = +args[1]
  drink.drink.liquid = args[2] as Liquid
  ItemBuilder.applyPoisonIfFlagged(drink, args[3])
  return drink
}
