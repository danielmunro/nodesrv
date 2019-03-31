import Attributes from "../../attributes/model/attributes"
import {Stat} from "../../attributes/stat"
import {WeaponType} from "../../item/weaponType"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { SpecializationType } from "./specializationType"

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
}
