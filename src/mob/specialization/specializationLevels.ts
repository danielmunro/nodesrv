import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import SpecializationLevel from "./specializationLevel"
import {SpecializationType} from "./specializationType"

export const defaultSpecializationLevels = [
  // warrior
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Bash, 1),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Trip, 3),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.DirtKick, 3),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Berserk, 5),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ShieldBlock, 5),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.FastHealing, 6),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.SecondAttack, 7),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Dodge, 8),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Disarm, 11),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.EnhancedDamage, 12),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Dodge, 13),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sharpen, 15),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ShieldBash, 18),

  // ranger
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Backstab, 1),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.DirtKick, 3),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Trip, 3),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sneak, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Dodge, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Peek, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sharpen, 8),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Steal, 11),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Envenom, 15),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.FastHealing, 16),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Disarm, 21),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.SecondAttack, 25),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.EnhancedDamage, 32),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Hamstring, 31),

  // cleric
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureLight, 1),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Feast, 3),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Bless, 5),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureSerious, 7),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Fireproof, 8),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.TowerOfIronWill, 10),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CurePoison, 13),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.RemoveCurse, 13),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionGood, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionEvil, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionNeutral, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.HolySilence, 16),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Cancellation, 18),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Heal, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Shield, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.StoneSkin, 25),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Crusade, 25),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Sanctuary, 30),

  // mage
  new SpecializationLevel(SpecializationType.Mage, SpellType.MagicMissile, 1),
  new SpecializationLevel(SpecializationType.Mage, SpellType.GiantStrength, 11),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Blind, 12),
  new SpecializationLevel(SpecializationType.Mage, SpellType.LightningBolt, 13),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Haste, 13),
  new SpecializationLevel(SpecializationType.Mage, SpellType.SummonUndead, 14),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Poison, 17),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Curse, 18),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DetectInvisible, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.TurnUndead, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Cancellation, 22),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Invisibility, 25),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DrawLife, 27),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Wrath, 30),
  new SpecializationLevel(SpecializationType.Mage, SpellType.WithstandDeath, 30),

  // weapon grants
  new SpecializationLevel(SpecializationType.Any, SkillType.Sword, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Mace, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Wand, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Dagger, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Stave, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Whip, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Spear, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Axe, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Flail, 1),
  new SpecializationLevel(SpecializationType.Any, SkillType.Polearm, 1),
]

export function getSpecializationLevel(specializationType: SpecializationType, abilityType: SkillType | SpellType) {
  return defaultSpecializationLevels.find(specializationLevel =>
    specializationLevel.specialization === specializationType &&
    specializationLevel.abilityType === abilityType)
  || new SpecializationLevel(SpecializationType.Noop, abilityType, -1)
}
