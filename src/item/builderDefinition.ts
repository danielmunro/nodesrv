import {ItemType} from "../import/enum/itemType"
import ItemPrototype from "./itemPrototype"
import {Item} from "./model/item"

export default class BuilderDefinition {
  constructor(
    public readonly itemType: ItemType,
    public readonly buildItem: (itemPrototype: ItemPrototype) => Item,
  ) {}
}
