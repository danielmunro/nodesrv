import {WeaponType} from "../../item/enum/weaponType"
import {newWeapon} from "../../item/factory/itemFactory"
import {Item} from "../../item/model/item"
import Weapon from "../../item/model/weapon"
import {DamageType} from "../../mob/fight/enum/damageType"
import {SpellType} from "../../spell/spellType"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype

  const weapon = newWeapon(name, description, WeaponType.Stave, DamageType.Magic) as Weapon
  weapon.castLevel = +args[0]
  weapon.maxCharges = +args[1]
  weapon.currentCharges = +args[2]
  weapon.spellType = args[3] as SpellType

  return weapon
}
