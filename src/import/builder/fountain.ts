import {ItemEntity} from "../../item/entity/itemEntity"
import {ItemType} from "../../item/enum/itemType"
import {createDrink, newItem} from "../../item/factory/itemFactory"
import ItemBuilder from "../itemBuilder"
import {liquidMap} from "../map/liquidMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  const fountain = newItem(ItemType.Fountain, name, description)
  fountain.drink = createDrink()
  fountain.drink.foodAmount = +args[0]
  fountain.drink.drinkAmount = +args[1]
  // @ts-ignore
  fountain.drink.liquid = liquidMap[args[2]]
  fountain.isTransferable = false
  ItemBuilder.applyPoisonIfFlagged(fountain, args[3])
  return fountain
}
