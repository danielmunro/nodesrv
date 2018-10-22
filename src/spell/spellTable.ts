import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import improve from "../improve/improve"
import blind from "./action/blind"
import cureLight from "./action/cureLight"
import curePoison from "./action/curePoison"
import curse from "./action/curse"
import giantStrength from "./action/giantStrength"
import lightningBolt from "./action/lightningBolt"
import magicMissile from "./action/magicMissile"
import poison from "./action/poison"
import shield from "./action/shield"
import { newDefinition } from "./factory"
import blindPrecondition from "./precondition/blind"
import cureLightPrecondition from "./precondition/cureLight"
import curePoisonPrecondition from "./precondition/curePoison"
import cursePrecondition from "./precondition/curse"
import giantStrengthPrecondition from "./precondition/giantStrength"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import poisonPrecondition from "./precondition/poison"
import shieldPrecondition from "./precondition/shield"
import SpellCollection from "./spellCollection"
import { SpellType } from "./spellType"

export default new SpellCollection([
  // attack
  newDefinition(SpellType.MagicMissile, ActionType.Offensive, magicMissilePrecondition,
    improve(magicMissile), DamageType.Magic),
  newDefinition(
    SpellType.LightningBolt, ActionType.Offensive, lightningBoltPrecondition,
    improve(lightningBolt), DamageType.Electric),

  // healing
  newDefinition(SpellType.CureLight, ActionType.Defensive, cureLightPrecondition,
    cureLight),

  // benedictions
  newDefinition(SpellType.Shield, ActionType.Defensive, shieldPrecondition, shield),
  newDefinition(SpellType.GiantStrength, ActionType.Defensive, giantStrengthPrecondition, giantStrength),

  // maladictions
  newDefinition(SpellType.Poison, ActionType.Offensive, poisonPrecondition, poison),
  newDefinition(SpellType.Curse, ActionType.Offensive, cursePrecondition, curse),
  newDefinition(SpellType.Blind, ActionType.Offensive, blindPrecondition, blind),

  // curative
  newDefinition(SpellType.CurePoison, ActionType.Defensive, curePoisonPrecondition, curePoison),
])
