import { newAttributesWithStats, newStats } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { Specialization } from "./specialization"
import { SpecializationType } from "./specializationType"

export default class Ranger implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Ranger
  }

  public getAttributes(): Attributes {
    return newAttributesWithStats(newStats(1, -1, 0, 2, 0, 1))
  }

  public getSkills(): SkillType[] {
    return [
      SkillType.Dagger,
      SkillType.DirtKick,
      SkillType.Dodge,
      SkillType.Parry,
      SkillType.Sneak,
    ]
  }

  public getSpells(): SpellType[] {
    return []
  }
}
