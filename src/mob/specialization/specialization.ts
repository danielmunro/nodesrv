import {Stat} from "../../attributes/enum/stat"
import Attributes from "../../attributes/model/attributes"
import {WeaponType} from "../../item/enum/weaponType"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { SpecializationType } from "./enum/specializationType"

export interface Specialization {
  getSkills(): SkillType[]
  getSpells(): SpellType[]
  getAttributes(): Attributes
  getSpecializationType(): SpecializationType
  getHpGainRange(): [number, number]
  getPrimaryStat(): Stat
  getSecondaryStat(): Stat
  getStartingWeaponType(): WeaponType
  getDamageModifier(): number
  getManaGainModifier(): number
}
