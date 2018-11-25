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

export default function getSpellTable(service: GameService) {
  const definition = service.definition()
  return new SpellCollection([
    // attack
    definition.spell(SpellType.MagicMissile, ActionType.Offensive,
      magicMissile, magicMissilePrecondition, DamageType.Magic),
    definition.spell(SpellType.LightningBolt, ActionType.Offensive,
      lightningBolt, lightningBoltPrecondition, DamageType.Electric),

    // healing
    definition.spell(SpellType.CureLight, ActionType.Defensive,
      cureLight, cureLightPrecondition),
    definition.spell(SpellType.Heal, ActionType.Defensive, heal, healPrecondition),

    // benedictions
    definition.spell(SpellType.Shield, ActionType.Defensive, shield, shieldPrecondition),
    definition.spell(SpellType.GiantStrength, ActionType.Defensive,
      giantStrength, giantStrengthPrecondition),
    definition.spell(SpellType.Wrath, ActionType.Defensive, wrath, wrathPrecondition),

    // maladictions
    definition.spell(SpellType.Poison, ActionType.Offensive, poison, poisonPrecondition),
    definition.spell(SpellType.Curse, ActionType.Offensive, curse, cursePrecondition),
    definition.spell(SpellType.Blind, ActionType.Offensive, blind, blindPrecondition),

    // curative
    definition.spell(SpellType.CurePoison, ActionType.Defensive,
      curePoison, curePoisonPrecondition),
  ])
}
