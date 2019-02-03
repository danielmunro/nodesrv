import { ActionType } from "../action/enum/actionType"
import BlindAction from "../action/impl/spell/blindAction"
import CureLightAction from "../action/impl/spell/cureLightAction"
import {AffectType} from "../affect/affectType"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
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
import cursePrecondition from "./precondition/curse"
import defaultSpellPrecondition from "./precondition/defaultSpellPrecondition"
import poisonPrecondition from "./precondition/poison"
import { SpellType } from "./spellType"

export default function getSpellTable(service: GameService) {
  const definition = service.definition()
  const checkBuilderFactory = new CheckBuilderFactory(service.mobService)
  const eventService = service.eventService
  return [
    // maladictions
    new BlindAction(checkBuilderFactory, eventService),

    // healing
    new CureLightAction(checkBuilderFactory, eventService),

    // attack
    definition.spell(
      SpellType.MagicMissile,
      ActionType.Offensive,
      magicMissile,
      defaultSpellPrecondition,
      15,
      SpecializationLevel.create(0, 1, 2, 2),
      undefined,
      DamageType.Magic),

    definition.spell(
      SpellType.LightningBolt,
      ActionType.Offensive,
      lightningBolt,
      defaultSpellPrecondition,
      15,
      SpecializationLevel.create(23, 13, 18, 16),
      undefined,
      DamageType.Electric),

    definition.spell(
      SpellType.CureSerious,
      ActionType.Defensive,
      cureSerious,
      defaultSpellPrecondition,
      15,
      SpecializationLevel.create(7, 0, 0, 9)),

    definition.spell(
      SpellType.Heal,
      ActionType.Defensive,
      heal,
      defaultSpellPrecondition,
      50,
      SpecializationLevel.create(20, 0, 33, 31)),

    // benedictions
    definition.spell(
      SpellType.Shield,
      ActionType.Defensive,
      shield,
      defaultSpellPrecondition,
      12,
      SpecializationLevel.create(20, 35, 40, 35),
      AffectType.Shield),

    definition.spell(
      SpellType.GiantStrength,
      ActionType.Defensive,
      giantStrength,
      defaultSpellPrecondition,
      20,
      SpecializationLevel.create(11, 0, 22, 20),
      AffectType.GiantStrength),

    definition.spell(
      SpellType.Wrath,
      ActionType.Defensive,
      wrath,
      defaultSpellPrecondition,
      25,
      SpecializationLevel.create(10, 10, 10, 10)),

    // maladictions
    definition.spell(
      SpellType.Poison,
      ActionType.Offensive,
      poison,
      poisonPrecondition,
      10,
      SpecializationLevel.create(17, 12, 15, 21),
      AffectType.Poison),

    definition.spell(
      SpellType.Curse,
      ActionType.Offensive,
      curse,
      cursePrecondition,
      20,
      SpecializationLevel.create(18, 18, 22, 26),
      AffectType.Curse),

    // curative
    definition.spell(
      SpellType.CurePoison,
      ActionType.Defensive,
      curePoison,
      defaultSpellPrecondition,
      5,
      SpecializationLevel.create(13, 0, 0, 18)),
  ]
}
