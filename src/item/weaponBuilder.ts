import {DamageType} from "../damage/damageType"
import ServiceBuilder from "../gameService/serviceBuilder"
import AbstractItemBuilder from "./abstractItemBuilder"
import {Equipment} from "./equipment"
import {ItemType} from "./itemType"
import Weapon from "./model/weapon"
import {WeaponType} from "./weaponType"

export default class WeaponBuilder extends AbstractItemBuilder {
  constructor(serviceBuilder: ServiceBuilder, protected readonly item: Weapon = new Weapon()) {
    super(serviceBuilder, item)
  }

  public asAxe(): WeaponBuilder {
    this.item.weaponType = WeaponType.Axe
    this.item.damageType = DamageType.Slash
    this.item.itemType = ItemType.Equipment
    this.item.equipment = Equipment.Weapon
    this.item.name = "a wood chopping axe"
    this.item.value = 10
    return this
  }

  public asMace(): WeaponBuilder {
    this.item.weaponType = WeaponType.Mace
    this.item.damageType = DamageType.Bash
    this.item.itemType = ItemType.Equipment
    this.item.equipment = Equipment.Weapon
    this.item.name = "a wooden practice mace"
    this.item.value = 10
    return this
  }
}
