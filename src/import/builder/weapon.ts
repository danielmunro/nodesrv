import {ItemEntity} from "../../item/entity/itemEntity"
import {WeaponType} from "../../item/enum/weaponType"
import {newWeapon} from "../../item/factory/itemFactory"
import {DamageType} from "../../mob/fight/enum/damageType"
import Maybe from "../../support/functional/maybe/maybe"
import {maybeExtraFlagWeaponWeaponEffect} from "./extraFlagWeaponEffectMap"
import ItemPrototype from "./itemPrototype"

export default function(itemPrototype: ItemPrototype): ItemEntity {
  const { name, description, extraFlag, args } = itemPrototype
  const weapon = newWeapon(name, description, args[0] as WeaponType, args[3] as DamageType)
  return new Maybe<ItemEntity>(extraFlag)
    .do(extra => {
      extra.split("").forEach((flag: string) =>
        maybeExtraFlagWeaponWeaponEffect(flag)
          .do(weaponEffect => weapon.weaponEffects.push(weaponEffect))
          .get())
      return weapon
    })
    .or(() => weapon)
    .get()
}
