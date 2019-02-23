import {DamageType} from "../damage/damageType"
import ServiceBuilder from "../gameService/serviceBuilder"
import {Equipment} from "../item/equipment"
import {ItemType} from "../item/itemType"
import Container from "../item/model/container"
import {Inventory} from "../item/model/inventory"
import {Item} from "../item/model/item"
import Weapon from "../item/model/weapon"
import {WeaponType} from "../item/weaponType"

export default class ItemBuilder {
  constructor(private readonly serviceBuilder: ServiceBuilder, private item: Item = new Item()) {}

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

  public asAxe(): ItemBuilder {
    const item = new Weapon()
    item.weaponType = WeaponType.Axe
    item.damageType = DamageType.Slash
    item.itemType = ItemType.Equipment
    item.equipment = Equipment.Weapon
    item.name = "a wood chopping axe"
    item.value = 10
    this.item = item
    return this
  }

  public asMace(): ItemBuilder {
    const item = new Weapon()
    item.weaponType = WeaponType.Mace
    item.damageType = DamageType.Bash
    item.itemType = ItemType.Equipment
    item.equipment = Equipment.Weapon
    item.name = "a wooden practice mace"
    item.value = 10
    this.item = item
    return this
  }

  public build(): Item {
    this.serviceBuilder.addItem(this.item)
    return this.item
  }
}
