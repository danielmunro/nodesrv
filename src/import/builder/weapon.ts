import {newWeapon} from "../../item/factory"
import ItemPrototype from "../../item/itemPrototype"
import {Item} from "../../item/model/item"
import {damageTypeMap} from "../map/damageTypeMap"
import {weaponTypeMap} from "../map/weaponTypeMap"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newWeapon(name, description, weaponTypeMap[args[0]], damageTypeMap[args[2]])
}
