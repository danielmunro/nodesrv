import {ItemEntity} from "../../item/entity/itemEntity"
import {WeaponEffect} from "../../item/enum/weaponEffect"
import {WeaponType} from "../../item/enum/weaponType"
import {newWeapon} from "../../item/factory/itemFactory"
import {DamageType} from "../../mob/fight/enum/damageType"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, extraFlag, args } = itemPrototype
  const weapon = newWeapon(name, description, args[0] as WeaponType, args[3] as DamageType)
  if (extraFlag) {
    extraFlag.split("").forEach((flag: string) => {
      const effect = getWeaponEffectFromExtraFlag(flag)
      if (effect) {
        weapon.weaponEffects.push(effect)
      }
    })
  }
  return weapon
}

function getWeaponEffectFromExtraFlag(flag: string): WeaponEffect | undefined {
  switch (flag) {
    case "A":
      return WeaponEffect.Flaming
    case "B":
      return WeaponEffect.Frost
    case "C":
      return WeaponEffect.Vampiric
    case "D":
      return WeaponEffect.Sharp
    case "E":
      return WeaponEffect.Vorpal
    case "G":
      return WeaponEffect.Shocking
    case "H":
      return WeaponEffect.Poison
    case "I":
      return WeaponEffect.Stun
    case "J":
      return WeaponEffect.Holy
    case "K":
      return WeaponEffect.Favored
    case "L":
      return WeaponEffect.Nether
    case "M":
      return WeaponEffect.Scion
    case "N":
      return WeaponEffect.ResistEnchant
    default:
      return
  }
}
