import {ItemEntity} from "../../item/entity/itemEntity"
import WeaponEntity from "../../item/entity/weaponEntity"
import {WeaponType} from "../../item/enum/weaponType"
import {newWeapon} from "../../item/factory/itemFactory"
import {DamageType} from "../../mob/fight/enum/damageType"
import {SpellType} from "../../mob/spell/spellType"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype

  const weapon = newWeapon(name, description, WeaponType.Wand, DamageType.Magic) as WeaponEntity
  weapon.castLevel = +args[0]
  weapon.maxCharges = +args[1]
  weapon.currentCharges = +args[2]
  weapon.spellType = args[3] as SpellType

  return weapon
}
