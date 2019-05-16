import AttributeBuilder from "../../../attributes/attributeBuilder"
import { newStats } from "../../../attributes/factory"
import Attributes from "../../../attributes/model/attributes"
import {Stat} from "../../../attributes/stat"
import {WeaponType} from "../../../item/enum/weaponType"
import { SkillType } from "../../../skill/skillType"
import { SpellType } from "../../../spell/spellType"
import { SpecializationType } from "../enum/specializationType"
import { Specialization } from "../specialization"

export default class Mage implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Mage
  }

  public getAttributes(): Attributes {
    return new AttributeBuilder()
      .setStats(newStats(-1, 2, 2, 0, -1, 0))
      .build()
  }

  public getHpGainRange(): [number, number] {
    return [6, 8]
  }

  public getPrimaryStat(): Stat {
    return Stat.Int
  }

  public getSecondaryStat(): Stat {
    return Stat.Wis
  }

  public getStartingWeaponType(): WeaponType {
    return WeaponType.Stave
  }

  public getDamageModifier(): number {
    return 0.87
  }

  public getManaGainModifier(): number {
    return 1
  }

  public getSkills(): SkillType[] {
    return [
      SkillType.Dagger,
      SkillType.Wand,
      SkillType.Stave,
      SkillType.Meditation,
      SkillType.Lore,
      SkillType.Spellcraft,
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
