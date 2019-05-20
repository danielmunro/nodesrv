import {Equipment} from "../enum/equipment"
import {ItemType} from "../enum/itemType"
import Container from "../model/container"
import {Inventory} from "../model/inventory"
import AbstractItemBuilder from "./abstractItemBuilder"

export default class ItemBuilder extends AbstractItemBuilder {
  public asFood(): ItemBuilder {
    this.item.itemType = ItemType.Food
    this.item.name = "a pretzel"
    this.item.hunger = 1
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

  public asShield(): ItemBuilder {
    this.item.itemType = ItemType.Equipment
    this.item.name = "a wooden practice shield"
    this.item.description = "a wooden practice shield"
    this.item.equipment = Equipment.Shield
    this.item.value = 10
    return this
  }

  public asKey(canonicalId: string): ItemBuilder {
    this.item.itemType = ItemType.Key
    this.item.name = "a small brass key"
    this.item.description = "a small brass key"
    this.item.value = 1
    this.item.canonicalId = canonicalId
    return this
  }
}