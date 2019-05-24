import {SkillType} from "../../../skill/skillType"
import {SpellType} from "../../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

export default [
  new SpecializationLevel(SpecializationType.Mage, SpellType.MagicMissile, 1),
  new SpecializationLevel(SpecializationType.Mage, SpellType.ChillTouch, 3),
  new SpecializationLevel(SpecializationType.Mage, SpellType.GiantStrength, 5),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Curse, 6),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Fireball, 8),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Fly, 8),
  new SpecializationLevel(SpecializationType.Mage, SpellType.WordOfRecall, 10),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Blind, 12),
  new SpecializationLevel(SpecializationType.Mage, SpellType.LightningBolt, 13),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Haste, 13),
  new SpecializationLevel(SpecializationType.Mage, SpellType.SummonUndead, 14),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Slow, 15),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Poison, 17),
  new SpecializationLevel(SpecializationType.Mage, SpellType.KnowAlignment, 19),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DetectInvisible, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DetectHidden, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.TurnUndead, 20),
  new SpecializationLevel(SpecializationType.Mage, SpellType.LocateItem, 21),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Cancellation, 22),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Invisibility, 25),
  new SpecializationLevel(SpecializationType.Mage, SpellType.DrawLife, 27),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Summon, 28),
  new SpecializationLevel(SpecializationType.Mage, SpellType.Wrath, 30),
  new SpecializationLevel(SpecializationType.Mage, SpellType.WithstandDeath, 30),
  new SpecializationLevel(SpecializationType.Mage, SpellType.OrbOfTouch, 34),
  new SpecializationLevel(SpecializationType.Mage, SpellType.OrbOfAwakening, 36),

  // skills
  new SpecializationLevel(SpecializationType.Mage, SkillType.Dodge, 15, 8),
  new SpecializationLevel(SpecializationType.Mage, SkillType.DirtKick, 20, 4),
  new SpecializationLevel(SpecializationType.Mage, SkillType.SecondAttack, 30, 8),
  new SpecializationLevel(SpecializationType.Mage, SkillType.Sneak, 40, 8),
]
