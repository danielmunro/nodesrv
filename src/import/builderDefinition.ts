import {Item} from "../item/model/item"
import ItemPrototype from "./builder/itemPrototype"
import {ItemType} from "./enum/itemType"

export type ItemFactory = (itemPrototype: ItemPrototype) => Item

export default interface BuilderDefinition {
  readonly itemType: ItemType
  readonly itemFactory: ItemFactory
}
