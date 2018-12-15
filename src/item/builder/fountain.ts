import {liquidMap} from "../../import/map/liquidMap"
import {newItem} from "../factory"
import ItemBuilder from "../itemBuilder"
import ItemPrototype from "../itemPrototype"
import {ItemType} from "../itemType"
import Drink from "../model/drink"
import {Item} from "../model/item"

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
