import { newAttributesWithStats, newStats } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { Specialization } from "./specialization"
import { SpecializationType } from "./specializationType"

export default class Mage implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Mage
  }

  public getAttributes(): Attributes {
    return newAttributesWithStats(newStats(-1, 2, 2, 0, -1, 0))
  }

  public getSkills(): SkillType[] {
    return [
      SkillType.Wand,
    ]
  }

  public getSpells(): SpellType[] {
    return [
      // damage
      SpellType.MagicMissile,
      SpellType.LightningBolt,
      SpellType.IceBlast,

      // maladiction
      SpellType.Curse,
      SpellType.Blind,

      // enhancement
      SpellType.GiantStrength,
      SpellType.Blur,
      SpellType.DetectInvisible,
      SpellType.Haste,
    ]
  }
}
