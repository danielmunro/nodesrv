import {damageTypeMap} from "../../import/map/damageTypeMap"
import {weaponTypeMap} from "../../import/map/weaponTypeMap"
import {newWeapon} from "../factory"
import {Item} from "../model/item"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): Item {
  return newWeapon(
      itemPrototype.name,
      itemPrototype.description,
      weaponTypeMap[itemPrototype.args[0]],
      damageTypeMap[itemPrototype.args[2]])

}
