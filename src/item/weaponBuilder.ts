import {DamageType} from "../damage/damageType"
import ServiceBuilder from "../gameService/serviceBuilder"
import AbstractItemBuilder from "./abstractItemBuilder"
import {Equipment} from "./equipment"
import {ItemType} from "./itemType"
import Weapon from "./model/weapon"
import {WeaponType} from "./weaponType"

export default class WeaponBuilder extends AbstractItemBuilder {
  protected readonly item: Weapon

  constructor(serviceBuilder: ServiceBuilder, carriedBy: any) {
    super(serviceBuilder, new Weapon(), carriedBy)
  }

  public asAxe(): WeaponBuilder {
    this.item.weaponType = WeaponType.Axe
    this.item.damageType = DamageType.Slash
    this.item.itemType = ItemType.Equipment
    this.item.equipment = Equipment.Weapon
    this.item.name = "a wood chopping axe"
    this.item.value = 10
    this.item.level = 1
    this.item.weight = 5.0
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
