import {ItemType} from "../import/enum/itemType"
import ItemPrototype from "./itemPrototype"
import {Item} from "./model/item"

export type ItemFactory = (itemPrototype: ItemPrototype) => Item

export default interface BuilderDefinition {
  readonly itemType: ItemType,
  readonly itemFactory: ItemFactory
}
