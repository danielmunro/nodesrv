import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import blind from "./action/blind"
import cureLight from "./action/cureLight"
import curePoison from "./action/curePoison"
import cureSerious from "./action/cureSerious"
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
import cureSeriousPrecondition from "./precondition/cureSerious"
import cursePrecondition from "./precondition/curse"
import giantStrengthPrecondition from "./precondition/giantStrength"
import healPrecondition from "./precondition/heal"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import poisonPrecondition from "./precondition/poison"
import shieldPrecondition from "./precondition/shield"
import wrathPrecondition from "./precondition/wrath"
import SpellLevel from "./spellLevel"
import { SpellType } from "./spellType"

export default function getSpellTable(service: GameService) {
  const definition = service.definition()
  return [
    // attack
    definition.spell(
      SpellType.MagicMissile,
      ActionType.Offensive,
      magicMissile,
      magicMissilePrecondition,
      15,
      SpellLevel.create(0, 1, 2, 2),
      DamageType.Magic),

    definition.spell(
      SpellType.LightningBolt,
      ActionType.Offensive,
      lightningBolt,
      lightningBoltPrecondition,
      15,
      SpellLevel.create(23, 13, 18, 16),
      DamageType.Electric),

    // healing
    definition.spell(
      SpellType.CureLight,
      ActionType.Defensive,
      cureLight,
      cureLightPrecondition,
      10,
      SpellLevel.create(1, 0, 0, 3)),

    definition.spell(
      SpellType.CureSerious,
      ActionType.Defensive,
      cureSerious,
      cureSeriousPrecondition,
      15,
      SpellLevel.create(7, 0, 0, 9)),

    definition.spell(
      SpellType.Heal,
      ActionType.Defensive,
      heal,
      healPrecondition,
      50,
      SpellLevel.create(20, 0, 33, 31)),

    // benedictions
    definition.spell(
      SpellType.Shield,
      ActionType.Defensive,
      shield,
      shieldPrecondition,
      12,
      SpellLevel.create(20, 35, 40, 35)),

    definition.spell(
      SpellType.GiantStrength,
      ActionType.Defensive,
      giantStrength,
      giantStrengthPrecondition,
      20,
      SpellLevel.create(11, 0, 22, 20)),

    definition.spell(
      SpellType.Wrath,
      ActionType.Defensive,
      wrath,
      wrathPrecondition,
      25,
      SpellLevel.create(10, 10, 10, 10)),

    // maladictions
    definition.spell(
      SpellType.Poison,
      ActionType.Offensive,
      poison,
      poisonPrecondition,
      10,
      SpellLevel.create(17, 12, 15, 21)),

    definition.spell(
      SpellType.Curse,
      ActionType.Offensive,
      curse,
      cursePrecondition,
      20,
      SpellLevel.create(18, 18, 22, 26)),

    definition.spell(
      SpellType.Blind,
      ActionType.Offensive,
      blind,
      blindPrecondition,
      20,
      SpellLevel.create(12, 8, 15, 17)),

    // curative
    definition.spell(
      SpellType.CurePoison,
      ActionType.Defensive,
      curePoison,
      curePoisonPrecondition,
      5,
      SpellLevel.create(13, 0, 0, 18)),
  ]
}
