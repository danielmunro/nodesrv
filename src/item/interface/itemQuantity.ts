import {ItemEntity} from "../entity/itemEntity"

export default interface ItemQuantity {
  readonly item: ItemEntity
  readonly canonicalId: string
  quantity: number
}
