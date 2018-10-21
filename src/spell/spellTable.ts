import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import cureLight from "./action/cureLight"
import curePoison from "./action/curePoison"
import giantStrength from "./action/giantStrength"
import lightningBolt from "./action/lightningBolt"
import magicMissile from "./action/magicMissile"
import poison from "./action/poison"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import shield from "./action/shield"
import SpellCollection from "./spellCollection"
import SpellDefinition from "./spellDefinition"
import { SpellType } from "./spellType"
import { newDefinition } from "./factory"

export default new SpellCollection([
  // attack
  newDefinition(SpellType.MagicMissile, ActionType.Offensive, magicMissilePrecondition,
    magicMissile, DamageType.Magic),
  newDefinition(
    SpellType.LightningBolt, ActionType.Offensive, lightningBoltPrecondition,
    lightningBolt, DamageType.Electric),

  // healing
  // newDefinition(SpellType.CureLight, ActionType.Defensive, )
  new SpellDefinition(
    SpellType.CureLight,
    1,
    ActionType.Defensive,
    50,
    cureLight,
  ),

  // Benedictions
  new SpellDefinition(
    SpellType.Shield,
    5,
    ActionType.Defensive,
    100,
    shield),
  new SpellDefinition(
    SpellType.GiantStrength,
    20,
    ActionType.Defensive,
    100,
    giantStrength),

  // Maladictions
  new SpellDefinition(
    SpellType.Poison,
    20,
    ActionType.Offensive,
    100,
    poison,
  ),

  // Curative
  new SpellDefinition(
    SpellType.CurePoison,
    20,
    ActionType.Defensive,
    100,
    curePoison,
  ),
])
