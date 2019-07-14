import {WeaponEffect} from "../../item/enum/weaponEffect"
import Maybe from "../../support/functional/maybe/maybe"

export interface ExtraFlagWeaponEffectMapType {
  [key: string]: WeaponEffect,
}

const map: ExtraFlagWeaponEffectMapType = {
  A: WeaponEffect.Flaming,
  B: WeaponEffect.Frost,
  C: WeaponEffect.Vampiric,
  D: WeaponEffect.Sharp,
  E: WeaponEffect.Vorpal,
  G: WeaponEffect.Shocking,
  H: WeaponEffect.Poison,
  I: WeaponEffect.Stun,
  J: WeaponEffect.Holy,
  K: WeaponEffect.Favored,
  L: WeaponEffect.Nether,
  M: WeaponEffect.Scion,
  N: WeaponEffect.ResistEnchant,
}

export function maybeExtraFlagWeaponWeaponEffect(flag: string) {
  return new Maybe(map[flag])
}
