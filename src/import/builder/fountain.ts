import {newItem} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {ItemType} from "../../item/itemType"
import Drink from "../../item/model/drink"
import {Item} from "../../item/model/item"
import ItemBuilder from "../itemBuilder"
import {liquidMap} from "../map/liquidMap"

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
