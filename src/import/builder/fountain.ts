import {ItemType} from "../../item/enum/itemType"
import {newItem} from "../../item/factory/factory"
import Drink from "../../item/model/drink"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"
import {liquidMap} from "../map/liquidMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  const fountain = newItem(ItemType.Fountain, name, description)
  fountain.drink = new Drink()
  fountain.drink.foodAmount = +args[0]
  fountain.drink.drinkAmount = +args[1]
  fountain.drink.liquid = liquidMap[args[2]]
  fountain.isTransferable = false
  ItemBuilder.applyPoisonIfFlagged(fountain, args[3])
  return fountain
}
