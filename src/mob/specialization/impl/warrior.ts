import AttributeBuilder from "../../../attributes/attributeBuilder"
import { newStats } from "../../../attributes/factory"
import Attributes from "../../../attributes/model/attributes"
import {Stat} from "../../../attributes/stat"
import {WeaponType} from "../../../item/weaponType"
import { SkillType } from "../../../skill/skillType"
import { SpellType } from "../../../spell/spellType"
import { Specialization } from "../specialization"
import { SpecializationType } from "../specializationType"

export default class Warrior implements Specialization {
  public getSpecializationType(): SpecializationType {
    return SpecializationType.Warrior
  }

  public getAttributes(): Attributes {
    return new AttributeBuilder()
      .setStats(newStats(2, -1, -2, 0, 1, 1))
      .build()
  }

  public getHpGainRange(): [number, number] {
    return [11, 15]
  }

  public getPrimaryStat(): Stat {
    return Stat.Str
  }

  public getSecondaryStat(): Stat {
    return Stat.Con
  }

  public getStartingWeaponType(): WeaponType {
    return WeaponType.Sword
  }

  public getDamageModifier(): number {
    return 1.2
  }

  public getSkills(): SkillType[] {
    return [
      // weapons
      SkillType.Sword,
      SkillType.Dagger,
      SkillType.Axe,
      SkillType.Flail,
      SkillType.Mace,
      SkillType.Polearm,
      SkillType.Spear,
      SkillType.Whip,

      // attacks
      SkillType.Bash,
      SkillType.Kick,

      // fighting
      SkillType.Disarm,
      SkillType.DirtKick,
      SkillType.SecondAttack,
      SkillType.ThirdAttack,
      SkillType.Dodge,
      SkillType.Parry,
      SkillType.DualWield,
      SkillType.ShieldBash,
      SkillType.ShieldBlock,
      SkillType.Throw,
      SkillType.EnhancedDamage,

      // buf
      SkillType.Berserk,

      // etc
      SkillType.Lore,
      SkillType.FastHealing,
    ]
  }

  public getSpells(): SpellType[] {
    return []
  }
}
