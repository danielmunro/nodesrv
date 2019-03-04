import AttributeBuilder from "../../attributes/attributeBuilder"
import { newStats } from "../../attributes/factory"
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
    return new AttributeBuilder()
      .setStats(newStats(1, -1, 0, 2, 0, 1))
      .build()
  }

  public getSkills(): SkillType[] {
    return [
      // weapons
      SkillType.Dagger,

      // reconnaissance
      SkillType.Sneak,
      SkillType.Hide,
      SkillType.Scan,
      SkillType.Peek,

      // attacks
      SkillType.DirtKick,
      SkillType.Trip,
      SkillType.Garotte,
      SkillType.Hamstring,
      SkillType.Backstab,
      SkillType.EnhancedDamage,

      // fighting
      SkillType.Dodge,
      SkillType.Parry,
      SkillType.ShieldBlock,

      // buf
      SkillType.Envenom,

      // other
      SkillType.FastHealing,
      SkillType.Lore,
      SkillType.Slice,
      SkillType.Steal,
      SkillType.Haggle,
    ]
  }

  public getSpells(): SpellType[] {
    return []
  }
}
