import ServiceBuilder from "../gameService/serviceBuilder"
import {Equipment} from "./equipment"
import {ItemType} from "./itemType"
import Container from "./model/container"
import {Inventory} from "./model/inventory"
import {Item} from "./model/item"

export default class ItemBuilder {
  constructor(private readonly serviceBuilder: ServiceBuilder, protected item: Item = new Item()) {}

  public addItemToContainerInventory(item: Item): ItemBuilder {
    this.item.container.inventory.addItem(item)
    return this
  }

  public addToInventory(inventory: Inventory): ItemBuilder {
    inventory.addItem(this.item)
    return this
  }

  public asSatchel(): ItemBuilder {
    this.item.itemType = ItemType.Container
    this.item.name = "a small leather satchel"
    this.item.container = new Container()
    this.item.container.inventory = new Inventory()
    return this
  }

  public asCorpse(): ItemBuilder {
    this.item.itemType = ItemType.Corpse
    this.item.name = "a corpse of an unnamed mob"
    this.item.container = new Container()
    this.item.container.inventory = new Inventory()
    return this
  }

  public asHelmet(): ItemBuilder {
    this.item.itemType = ItemType.Equipment
    this.item.name = "a baseball cap"
    this.item.equipment = Equipment.Head
    this.item.value = 10
    return this
  }

  public build(): Item {
    this.serviceBuilder.addItem(this.item)
    return this.item
  }
}
