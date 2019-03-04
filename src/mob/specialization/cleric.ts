import AttributeBuilder from "../../attributes/attributeBuilder"
import { newStats } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { Specialization } from "./specialization"
import { SpecializationType } from "./specializationType"

export default class Cleric implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Cleric
  }

  public getAttributes(): Attributes {
    return new AttributeBuilder()
      .setStats(newStats(-1, 2, 2, -1, 0, 0))
      .build()
  }

  public getSkills(): SkillType[] {
    return [
      SkillType.Mace,
      SkillType.Wand,
      SkillType.Stave,
      SkillType.Meditation,
      SkillType.Lore,
      SkillType.Spellcraft,
    ]
  }

  public getSpells(): SpellType[] {
    return [
      // healing
      SpellType.CureLight,
      SpellType.CureSerious,
      SpellType.Heal,

      // curative
      SpellType.CureBlindness,
      SpellType.CurePoison,
      SpellType.RemoveCurse,

      // benedictions
      SpellType.Haste,
      SpellType.GiantStrength,
      SpellType.Bless,
    ]
  }
}
