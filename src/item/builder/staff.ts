import {DamageType} from "../../damage/damageType"
import {SpellType} from "../../spell/spellType"
import {newWeapon} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"
import Weapon from "../model/weapon"
import {WeaponType} from "../weaponType"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype

  const weapon = newWeapon(name, description, WeaponType.Stave, DamageType.Magic) as Weapon
  weapon.castLevel = +args[0]
  weapon.maxCharges = +args[1]
  weapon.currentCharges = +args[2]
  weapon.spellType = args[3] as SpellType

  return weapon
}
