import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
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
import blindPrecondition from "./precondition/blind"
import cureLightPrecondition from "./precondition/cureLight"
import cureSeriousPrecondition from "./precondition/cureSerious"
import curePoisonPrecondition from "./precondition/curePoison"
import cursePrecondition from "./precondition/curse"
import giantStrengthPrecondition from "./precondition/giantStrength"
import healPrecondition from "./precondition/heal"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import poisonPrecondition from "./precondition/poison"
import shieldPrecondition from "./precondition/shield"
import wrathPrecondition from "./precondition/wrath"
import { SpellType } from "./spellType"
import cureSerious from "./action/cureSerious"

export default function getSpellTable(service: GameService) {
  const definition = service.definition()
  return [
    // attack
    definition.spell(SpellType.MagicMissile, ActionType.Offensive,
      magicMissile, magicMissilePrecondition, 15, DamageType.Magic),
    definition.spell(SpellType.LightningBolt, ActionType.Offensive,
      lightningBolt, lightningBoltPrecondition, 15, DamageType.Electric),

    // healing
    definition.spell(SpellType.CureLight, ActionType.Defensive,
      cureLight, cureLightPrecondition, 10),
    definition.spell(SpellType.CureLight, ActionType.Defensive,
      cureSerious, cureSeriousPrecondition, 15),
    definition.spell(SpellType.Heal, ActionType.Defensive, heal, healPrecondition, 50),

    // benedictions
    definition.spell(SpellType.Shield, ActionType.Defensive, shield, shieldPrecondition, 12),
    definition.spell(SpellType.GiantStrength, ActionType.Defensive,
      giantStrength, giantStrengthPrecondition, 20),
    definition.spell(SpellType.Wrath, ActionType.Defensive, wrath, wrathPrecondition, 25),

    // maladictions
    definition.spell(SpellType.Poison, ActionType.Offensive, poison, poisonPrecondition, 10),
    definition.spell(SpellType.Curse, ActionType.Offensive, curse, cursePrecondition, 20),
    definition.spell(SpellType.Blind, ActionType.Offensive, blind, blindPrecondition, 20),

    // curative
    definition.spell(SpellType.CurePoison, ActionType.Defensive,
      curePoison, curePoisonPrecondition, 5),
  ]
}
