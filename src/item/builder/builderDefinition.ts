import {ItemType} from "../../import/enum/itemType"
import {Item} from "../model/item"
import ItemPrototype from "./itemPrototype"

export default class BuilderDefinition {
  constructor(
    public readonly itemType: ItemType,
    public readonly builder: (itemPrototype: ItemPrototype) => Item,
  ) {}
}
