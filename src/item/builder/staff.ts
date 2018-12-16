import {DamageType} from "../../damage/damageType"
import {newWeapon} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"
import {WeaponType} from "../weaponType"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description } = itemPrototype
  return newWeapon(name, description, WeaponType.Stave, DamageType.Magic)
}
