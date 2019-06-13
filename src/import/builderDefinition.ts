import {ItemEntity} from "../item/entity/itemEntity"
import ItemPrototype from "./builder/itemPrototype"
import {ItemType} from "./enum/itemType"

export type ItemFactory = (itemPrototype: ItemPrototype) => ItemEntity

export default interface BuilderDefinition {
  readonly itemType: ItemType
  readonly itemFactory: ItemFactory
}
