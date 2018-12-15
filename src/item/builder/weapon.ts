import {damageTypeMap} from "../../import/map/damageTypeMap"
import {weaponTypeMap} from "../../import/map/weaponTypeMap"
import {newWeapon} from "../factory"
import ItemPrototype from "../itemPrototype"
import {Item} from "../model/item"

export default function(itemPrototype: ItemPrototype): Item {
  return newWeapon(
    itemPrototype.name,
    itemPrototype.description,
    weaponTypeMap[itemPrototype.args[0]],
    damageTypeMap[itemPrototype.args[2]])
}
