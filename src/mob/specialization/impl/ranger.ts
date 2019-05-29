import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {Stat} from "../../../attributes/enum/stat"
import Attributes from "../../../attributes/model/attributes"
import {WeaponType} from "../../../item/enum/weaponType"
import { SkillType } from "../../../skill/skillType"
import { SpellType } from "../../../spell/spellType"
import { SpecializationType } from "../enum/specializationType"
import { Specialization } from "../specialization"

export default class Ranger implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Ranger
  }

  public getAttributes(): Attributes {
    return new AttributeBuilder()
      .setStats(1, -1, 0, 2, 0, 1)
      .build()
  }

  public getHpGainRange(): [number, number] {
    return [8, 13]
  }

  public getPrimaryStat(): Stat {
    return Stat.Dex
  }

  public getSecondaryStat(): Stat {
    return Stat.Int
  }

  public getStartingWeaponType(): WeaponType {
    return WeaponType.Dagger
  }

  public getDamageModifier(): number {
    return 1.12
  }

  public getManaGainModifier(): number {
    return 0.5
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
