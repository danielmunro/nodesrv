import { ActionType } from "../action/enum/actionType"
import CurePoisonAction from "../action/impl/spell/curative/curePoisonAction"
import GiantStrengthAction from "../action/impl/spell/enhancement/giantStrengthAction"
import CureLightAction from "../action/impl/spell/healing/cureLightAction"
import BlindAction from "../action/impl/spell/maladiction/blindAction"
import CurseAction from "../action/impl/spell/maladiction/curseAction"
import PoisonAction from "../action/impl/spell/maladiction/poisonAction"
import {AffectType} from "../affect/affectType"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import cureSerious from "./action/cureSerious"
import heal from "./action/heal"
import lightningBolt from "./action/lightningBolt"
import magicMissile from "./action/magicMissile"
import shield from "./action/shield"
import wrath from "./action/wrath"
import defaultSpellPrecondition from "./precondition/defaultSpellPrecondition"
import { SpellType } from "./spellType"

export default function getSpellTable(service: GameService) {
  const definition = service.definition()
  const checkBuilderFactory = new CheckBuilderFactory(service.mobService)
  const eventService = service.eventService
  return [
    // maladictions
    new BlindAction(checkBuilderFactory, eventService),
    new CurseAction(checkBuilderFactory, eventService),
    new PoisonAction(checkBuilderFactory, eventService),

    // healing
    new CureLightAction(checkBuilderFactory, eventService),

    // curative
    new CurePoisonAction(checkBuilderFactory, eventService),

    // enhancements
    new GiantStrengthAction(checkBuilderFactory, eventService),

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
      SpellType.Wrath,
      ActionType.Defensive,
      wrath,
      defaultSpellPrecondition,
      25,
      SpecializationLevel.create(10, 10, 10, 10)),
  ]
}
