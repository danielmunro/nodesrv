import { ActionType } from "../action/enum/actionType"
import MagicMissileAction from "../action/impl/spell/attack/magicMissileAction"
import CurePoisonAction from "../action/impl/spell/curative/curePoisonAction"
import GiantStrengthAction from "../action/impl/spell/enhancement/giantStrengthAction"
import CureLightAction from "../action/impl/spell/healing/cureLightAction"
import CureSeriousAction from "../action/impl/spell/healing/cureSeriousAction"
import HealAction from "../action/impl/spell/healing/healAction"
import BlindAction from "../action/impl/spell/maladiction/blindAction"
import CurseAction from "../action/impl/spell/maladiction/curseAction"
import PoisonAction from "../action/impl/spell/maladiction/poisonAction"
import {AffectType} from "../affect/affectType"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import lightningBolt from "./action/lightningBolt"
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
    new CureSeriousAction(checkBuilderFactory, eventService),
    new HealAction(checkBuilderFactory, eventService),

    // curative
    new CurePoisonAction(checkBuilderFactory, eventService),

    // enhancements
    new GiantStrengthAction(checkBuilderFactory, eventService),

    // attack
    new MagicMissileAction(checkBuilderFactory, eventService),

    // attack
    definition.spell(
      SpellType.LightningBolt,
      ActionType.Offensive,
      lightningBolt,
      defaultSpellPrecondition,
      15,
      SpecializationLevel.create(23, 13, 18, 16),
      undefined,
      DamageType.Electric),

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
