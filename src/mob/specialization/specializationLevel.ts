import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "./specializationType"

export default class SpecializationLevel {
  constructor(
    public readonly specialization: SpecializationType,
    public readonly abilityType: SkillType | SpellType,
    public readonly minimumLevel: number,
  ) {}
}
