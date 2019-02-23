import ServiceBuilder from "../gameService/serviceBuilder"
import {ItemType} from "../item/itemType"
import Container from "../item/model/container"
import {Inventory} from "../item/model/inventory"
import {Item} from "../item/model/item"

export default class ItemBuilder {
  constructor(private readonly serviceBuilder: ServiceBuilder, private readonly item: Item = new Item()) {
    if (item.itemType === ItemType.Corpse || item.itemType === ItemType.Container) {
      item.container = new Container()
      item.container.inventory = new Inventory()
    }
    this.serviceBuilder.addItem(this.item)
  }

  public addItemToContainerInventory(item: Item): ItemBuilder {
    this.item.container.inventory.addItem(item)
    return this
  }

  public addToInventory(inventory: Inventory): ItemBuilder {
    inventory.addItem(this.item)
    return this
  }

  public asFurniture(): ItemBuilder {
    this.item.itemType = ItemType.Fixture
    this.item.name = "a small wooden chair"
    return this
  }

  public build(): Item {
    return this.item
  }
}
