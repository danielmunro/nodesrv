import LightningBoltAction from "../action/impl/spell/attack/lightningBoltAction"
import MagicMissileAction from "../action/impl/spell/attack/magicMissileAction"
import CurePoisonAction from "../action/impl/spell/curative/curePoisonAction"
import DetectInvisibleAction from "../action/impl/spell/detection/detectInvisibleAction"
import GiantStrengthAction from "../action/impl/spell/enhancement/giantStrengthAction"
import CureLightAction from "../action/impl/spell/healing/cureLightAction"
import CureSeriousAction from "../action/impl/spell/healing/cureSeriousAction"
import HealAction from "../action/impl/spell/healing/healAction"
import InvisibilityAction from "../action/impl/spell/illusion/invisibilityAction"
import BlindAction from "../action/impl/spell/maladiction/blindAction"
import CurseAction from "../action/impl/spell/maladiction/curseAction"
import PoisonAction from "../action/impl/spell/maladiction/poisonAction"
import WrathAction from "../action/impl/spell/maladiction/wrathAction"
import ShieldAction from "../action/impl/spell/protective/shieldAction"
import StoneSkinAction from "../action/impl/spell/protective/stoneSkinAction"
import Spell from "../action/spell"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"

export default function getSpellTable(mobService: MobService, eventService: EventService): Spell[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  return [
    // maladictions
    new BlindAction(checkBuilderFactory, eventService),
    new CurseAction(checkBuilderFactory, eventService),
    new PoisonAction(checkBuilderFactory, eventService),
    new WrathAction(checkBuilderFactory, eventService),

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
    new LightningBoltAction(checkBuilderFactory, eventService),

    // protective
    new ShieldAction(checkBuilderFactory, eventService),
    new StoneSkinAction(checkBuilderFactory, eventService),

    // illusion
    new InvisibilityAction(checkBuilderFactory, eventService),

    // detection
    new DetectInvisibleAction(checkBuilderFactory, eventService),
  ]
}
