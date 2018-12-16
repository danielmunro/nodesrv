import {DamageType} from "../../damage/damageType"
import {newWeapon} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"
import {WeaponType} from "../weaponType"
import Weapon from "../model/weapon"
import {SpellType} from "../../spell/spellType"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype

  const weapon = newWeapon(name, description, WeaponType.Wand, DamageType.Magic) as Weapon
  weapon.castLevel = +args[0]
  weapon.maxCharges = +args[1]
  weapon.currentCharges = +args[2]
  weapon.spellType = args[3] as SpellType

  return weapon
}
