import {Item} from "./model/item"

export default interface ItemQuantity {
  readonly item: Item
  readonly canonicalId: string
  quantity: number
}
