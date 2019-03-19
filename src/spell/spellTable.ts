import CurePoisonAction from "../action/impl/spell/cleric/curative/curePoisonAction"
import FeastAction from "../action/impl/spell/cleric/curative/feastAction"
import RemoveCurseAction from "../action/impl/spell/cleric/curative/removeCurseAction"
import CureLightAction from "../action/impl/spell/cleric/healing/cureLightAction"
import CureSeriousAction from "../action/impl/spell/cleric/healing/cureSeriousAction"
import HealAction from "../action/impl/spell/cleric/healing/healAction"
import blessAction from "../action/impl/spell/cleric/piety/blessAction"
import CrusadeAction from "../action/impl/spell/cleric/piety/crusadeAction"
import CancellationAction from "../action/impl/spell/cleric/protective/cancellationAction"
import FireproofAction from "../action/impl/spell/cleric/protective/fireproofAction"
import ProtectionEvilAction from "../action/impl/spell/cleric/protective/protectionEvilAction"
import ProtectionGoodAction from "../action/impl/spell/cleric/protective/protectionGoodAction"
import ProtectionNeutralAction from "../action/impl/spell/cleric/protective/protectionNeutralAction"
import SanctuaryAction from "../action/impl/spell/cleric/protective/sanctuaryAction"
import ShieldAction from "../action/impl/spell/cleric/protective/shieldAction"
import StoneSkinAction from "../action/impl/spell/cleric/protective/stoneSkinAction"
import TowerOfIronWillAction from "../action/impl/spell/cleric/psionics/towerOfIronWillAction"
import LightningBoltAction from "../action/impl/spell/mage/attack/lightningBoltAction"
import MagicMissileAction from "../action/impl/spell/mage/attack/magicMissileAction"
import DetectInvisibleAction from "../action/impl/spell/mage/detection/detectInvisibleAction"
import GiantStrengthAction from "../action/impl/spell/mage/enhancement/giantStrengthAction"
import HasteAction from "../action/impl/spell/mage/enhancement/hasteAction"
import InvisibilityAction from "../action/impl/spell/mage/illusion/invisibilityAction"
import BlindAction from "../action/impl/spell/mage/maladiction/blindAction"
import CurseAction from "../action/impl/spell/mage/maladiction/curseAction"
import PoisonAction from "../action/impl/spell/mage/maladiction/poisonAction"
import WrathAction from "../action/impl/spell/mage/maladiction/wrathAction"
import DrawLifeAction from "../action/impl/spell/mage/necromancy/drawLifeAction"
import SummonUndeadAction from "../action/impl/spell/mage/necromancy/summonUndeadAction"
import TurnUndeadAction from "../action/impl/spell/mage/necromancy/turnUndeadAction"
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
    new RemoveCurseAction(checkBuilderFactory, eventService),
    new FeastAction(checkBuilderFactory, eventService),

    // enhancements
    new GiantStrengthAction(checkBuilderFactory, eventService),
    new HasteAction(checkBuilderFactory, eventService),

    // attack
    new MagicMissileAction(checkBuilderFactory, eventService),
    new LightningBoltAction(checkBuilderFactory, eventService),

    // protective
    new ShieldAction(checkBuilderFactory, eventService),
    new StoneSkinAction(checkBuilderFactory, eventService),
    new CancellationAction(checkBuilderFactory, eventService),
    new SanctuaryAction(checkBuilderFactory, eventService),
    new ProtectionGoodAction(checkBuilderFactory, eventService),
    new ProtectionEvilAction(checkBuilderFactory, eventService),
    new ProtectionNeutralAction(checkBuilderFactory, eventService),
    new FireproofAction(checkBuilderFactory, eventService),

    // illusion
    new InvisibilityAction(checkBuilderFactory, eventService),

    // detection
    new DetectInvisibleAction(checkBuilderFactory, eventService),

    // piety
    blessAction(checkBuilderFactory, eventService),
    new CrusadeAction(checkBuilderFactory, eventService),

    // necromancy
    new SummonUndeadAction(checkBuilderFactory, eventService, mobService),
    new TurnUndeadAction(checkBuilderFactory, eventService, mobService),
    new DrawLifeAction(checkBuilderFactory, eventService),

    // psionics
    new TowerOfIronWillAction(checkBuilderFactory, eventService),
  ]
}
