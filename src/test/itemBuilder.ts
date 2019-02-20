import {Item} from "../item/model/item"

export default class ItemBuilder {
  constructor(private readonly item: Item) {}

  public addItemToContainerInventory(item: Item) {
    this.item.container.inventory.addItem(item)
  }

  public build(): Item {
    return this.item
  }
}
