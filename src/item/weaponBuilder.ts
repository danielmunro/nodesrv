import {DamageType} from "../mob/fight/damageType"
import AbstractItemBuilder from "./abstractItemBuilder"
import {Equipment} from "./enum/equipment"
import {ItemType} from "./enum/itemType"
import {WeaponType} from "./enum/weaponType"
import Weapon from "./model/weapon"

export default class WeaponBuilder extends AbstractItemBuilder {
  protected readonly item: Weapon

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
