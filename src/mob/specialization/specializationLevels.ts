import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import SpecializationLevel from "./specializationLevel"
import {SpecializationType} from "./specializationType"

const specializationLevels = [
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Bash, 1),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Berserk, 1),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Trip, 3),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.EnhancedDamage, 5),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.FastHealing, 6),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.SecondAttack, 7),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Disarm, 11),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Dodge, 13),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ShieldBash, 18),

  new SpecializationLevel(SpecializationType.Ranger, SkillType.Dodge, 1),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Backstab, 1),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.DirtKick, 3),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sneak, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sharpen, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Steal, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.SecondAttack, 12),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Envenom, 15),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.FastHealing, 16),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.EnhancedDamage, 25),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Hamstring, 31),

  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureLight, 1),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureSerious, 7),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CurePoison, 13),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Heal, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Shield, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.StoneSkin, 25),

  new SpecializationLevel(SpecializationType.Mage, SpellType.MagicMissile, 1),
  new SpecializationLevel(SpecializationType.Mage, SpellType.GiantStrength, 11),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Blind, 12),
  new SpecializationLevel(SpecializationType.Mage, SpellType.LightningBolt, 13),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Poison, 17),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Curse, 18),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DetectInvisible, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Invisibility, 25),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Wrath, 30),
]

export function getSpecializationLevel(specializationType: SpecializationType, abilityType: SkillType | SpellType) {
  return specializationLevels.find(specializationLevel =>
    specializationLevel.specialization === specializationType &&
    specializationLevel.abilityType === abilityType)
  || new SpecializationLevel(SpecializationType.Noop, abilityType, -1)
}
