import Attributes from "../../attributes/model/attributes"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { SpecializationType } from "./specializationType"

export interface Specialization {
  getSkills(): SkillType[]
  getSpells(): SpellType[]
  getAttributes(): Attributes
  getSpecializationType(): SpecializationType
}
