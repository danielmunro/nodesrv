import {ItemEntity} from "../../item/entity/itemEntity"
import {newWeapon} from "../../item/factory/itemFactory"
import {damageTypeMap} from "../map/damageTypeMap"
import {weaponTypeMap} from "../map/weaponTypeMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, args } = itemPrototype
  return newWeapon(name, description, weaponTypeMap[args[0]], damageTypeMap[args[2]])
}
