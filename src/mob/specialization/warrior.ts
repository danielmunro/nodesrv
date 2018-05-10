import { newAttributesWithStats, newStats } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { Specialization } from "./specialization"
import { SpecializationType } from "./specializationType"

export default class Warrior implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Warrior
  }

  public getAttributes(): Attributes {
    return newAttributesWithStats(newStats(2, -1, -2, 0, 1, 1))
  }

  public getSkills(): SkillType[] {
    return [
      SkillType.Sword,
      SkillType.Bash,
      SkillType.Berserk,
      SkillType.Disarm,
      SkillType.SecondAttack,
      SkillType.Dodge,
      SkillType.Parry,
    ]
  }

  public getSpells(): SpellType[] {
    return []
  }
}
