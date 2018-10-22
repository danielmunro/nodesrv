import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import improve from "../improve/improve"
import blind from "./action/blind"
import cureLight from "./action/cureLight"
import curePoison from "./action/curePoison"
import curse from "./action/curse"
import giantStrength from "./action/giantStrength"
import heal from "./action/heal"
import lightningBolt from "./action/lightningBolt"
import magicMissile from "./action/magicMissile"
import poison from "./action/poison"
import shield from "./action/shield"
import wrath from "./action/wrath"
import { newDefinition } from "./factory"
import blindPrecondition from "./precondition/blind"
import cureLightPrecondition from "./precondition/cureLight"
import curePoisonPrecondition from "./precondition/curePoison"
import cursePrecondition from "./precondition/curse"
import giantStrengthPrecondition from "./precondition/giantStrength"
import healPrecondition from "./precondition/heal"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import poisonPrecondition from "./precondition/poison"
import shieldPrecondition from "./precondition/shield"
import wrathPrecondition from "./precondition/wrath"
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
    improve(cureLight)),
  newDefinition(SpellType.Heal, ActionType.Defensive, healPrecondition,
    improve(heal)),

  // benedictions
  newDefinition(SpellType.Shield, ActionType.Defensive, shieldPrecondition, improve(shield)),
  newDefinition(SpellType.GiantStrength, ActionType.Defensive, giantStrengthPrecondition, improve(giantStrength)),
  newDefinition(SpellType.Wrath, ActionType.Defensive, wrathPrecondition, improve(wrath)),

  // maladictions
  newDefinition(SpellType.Poison, ActionType.Offensive, poisonPrecondition, improve(poison)),
  newDefinition(SpellType.Curse, ActionType.Offensive, cursePrecondition, improve(curse)),
  newDefinition(SpellType.Blind, ActionType.Offensive, blindPrecondition, improve(blind)),

  // curative
  newDefinition(SpellType.CurePoison, ActionType.Defensive, curePoisonPrecondition, improve(curePoison)),
])
