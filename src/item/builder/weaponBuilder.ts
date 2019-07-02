import {DamageType} from "../../mob/fight/enum/damageType"
import {ItemEntity} from "../entity/itemEntity"
import {Equipment} from "../enum/equipment"
import {ItemType} from "../enum/itemType"
import {WeaponEffect} from "../enum/weaponEffect"
import {WeaponType} from "../enum/weaponType"
import AbstractItemBuilder from "./abstractItemBuilder"

export default class WeaponBuilder extends AbstractItemBuilder {
  protected readonly item: ItemEntity

  public asDagger(): WeaponBuilder {
    this.item.weaponType = WeaponType.Dagger
    this.item.damageType = DamageType.Pierce
    this.item.itemType = ItemType.Equipment
    this.item.equipment = Equipment.Weapon
    this.item.name = "a practice dagger"
    this.item.value = 10
    this.item.level = 1
    this.item.weight = 1.0
    return this
  }

  public asAxe(): WeaponBuilder {
    this.item.weaponType = WeaponType.Axe
    this.item.damageType = DamageType.Slash
    this.item.itemType = ItemType.Equipment
    this.item.equipment = Equipment.Weapon
    this.item.name = "a wood chopping axe"
    this.item.brief = this.item.name
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

  public setDamageType(damageType: DamageType): WeaponBuilder {
    this.item.damageType = damageType
    return this
  }

  public addWeaponEffect(weaponEffect: WeaponEffect): WeaponBuilder {
    if (!this.item.weaponEffects) {
      this.item.weaponEffects = []
    }
    this.item.weaponEffects.push(weaponEffect)
    return this
  }
}
