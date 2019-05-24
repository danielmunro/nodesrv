import {newWeapon} from "../../item/factory/factory"
import {Item} from "../../item/model/item"
import {damageTypeMap} from "../map/damageTypeMap"
import {weaponTypeMap} from "../map/weaponTypeMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  const { name, description, args } = itemPrototype
  return newWeapon(name, description, weaponTypeMap[args[0]], damageTypeMap[args[2]])
}
