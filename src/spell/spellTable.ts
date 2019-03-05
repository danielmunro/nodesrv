import CurePoisonAction from "../action/impl/spell/cleric/curative/curePoisonAction"
import CureLightAction from "../action/impl/spell/cleric/healing/cureLightAction"
import CureSeriousAction from "../action/impl/spell/cleric/healing/cureSeriousAction"
import HealAction from "../action/impl/spell/cleric/healing/healAction"
import BlessAction from "../action/impl/spell/cleric/piety/blessAction"
import CrusadeAction from "../action/impl/spell/cleric/piety/crusadeAction"
import CancellationAction from "../action/impl/spell/cleric/protective/cancellationAction"
import SanctuaryAction from "../action/impl/spell/cleric/protective/sanctuaryAction"
import ShieldAction from "../action/impl/spell/cleric/protective/shieldAction"
import StoneSkinAction from "../action/impl/spell/cleric/protective/stoneSkinAction"
import LightningBoltAction from "../action/impl/spell/mage/attack/lightningBoltAction"
import MagicMissileAction from "../action/impl/spell/mage/attack/magicMissileAction"
import DetectInvisibleAction from "../action/impl/spell/mage/detection/detectInvisibleAction"
import GiantStrengthAction from "../action/impl/spell/mage/enhancement/giantStrengthAction"
import InvisibilityAction from "../action/impl/spell/mage/illusion/invisibilityAction"
import BlindAction from "../action/impl/spell/mage/maladiction/blindAction"
import CurseAction from "../action/impl/spell/mage/maladiction/curseAction"
import PoisonAction from "../action/impl/spell/mage/maladiction/poisonAction"
import WrathAction from "../action/impl/spell/mage/maladiction/wrathAction"
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
    new CancellationAction(checkBuilderFactory, eventService),
    new SanctuaryAction(checkBuilderFactory, eventService),

    // illusion
    new InvisibilityAction(checkBuilderFactory, eventService),

    // detection
    new DetectInvisibleAction(checkBuilderFactory, eventService),

    // piety
    new BlessAction(checkBuilderFactory, eventService),
    new CrusadeAction(checkBuilderFactory, eventService),
  ]
}
