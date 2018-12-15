import {damageTypeMap} from "../../import/map/damageTypeMap"
import {weaponTypeMap} from "../../import/map/weaponTypeMap"
import {newWeapon} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newWeapon(name, description, weaponTypeMap[args[0]], damageTypeMap[args[2]])
}
