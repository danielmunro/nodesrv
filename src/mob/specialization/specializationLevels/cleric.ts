import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

export default [
  // spells
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureLight, 1),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Feast, 3),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Bless, 5),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CureSerious, 7),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.RefreshMovement, 8),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Fireproof, 8),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.TowerOfIronWill, 10),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.PsionicBlast, 12),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.CurePoison, 13),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.RemoveCurse, 13),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionGood, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionEvil, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.ProtectionNeutral, 15),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.HolySilence, 16),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Cancellation, 18),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.KnowAlignment, 19),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Heal, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Shield, 20),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.StoneSkin, 25),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Crusade, 25),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.LocateItem, 28),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.Sanctuary, 30),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.OrbOfTouch, 32),
  new SpecializationLevel(SpecializationType.Cleric, SpellType.OrbOfAwakening, 34),

  // skills
  new SpecializationLevel(SpecializationType.Cleric, SkillType.Dodge, 15, 8),
  new SpecializationLevel(SpecializationType.Cleric, SkillType.DirtKick, 20, 4),
  new SpecializationLevel(SpecializationType.Cleric, SkillType.SecondAttack, 30, 8),
  new SpecializationLevel(SpecializationType.Cleric, SkillType.Sneak, 40, 8),
]
