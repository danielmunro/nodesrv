import {DamageType} from "../../damage/damageType"
import {WeaponType} from "../../item/enum/weaponType"
import {newWeapon} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"
import Weapon from "../../item/model/weapon"
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
