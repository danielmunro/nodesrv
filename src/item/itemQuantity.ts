import {Item} from "./model/item"

export default class ItemQuantity {
  public readonly canonicalId: string
  private quantity: number = 0

  constructor(
    public readonly item: Item,
  ) {
    this.canonicalId = item.canonicalId
  }

  public incrementQuantity() {
    this.quantity++
  }

  public getQuantity(): number {
    return this.quantity
  }
}
