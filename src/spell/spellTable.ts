import CurePoisonAction from "../action/impl/spell/cleric/curative/curePoisonAction"
import FeastAction from "../action/impl/spell/cleric/curative/feastAction"
import RemoveCurseAction from "../action/impl/spell/cleric/curative/removeCurseAction"
import CureLightAction from "../action/impl/spell/cleric/healing/cureLightAction"
import CureSeriousAction from "../action/impl/spell/cleric/healing/cureSeriousAction"
import HealAction from "../action/impl/spell/cleric/healing/healAction"
import blessAction from "../action/impl/spell/cleric/piety/blessAction"
import crusadeAction from "../action/impl/spell/cleric/piety/crusadeAction"
import CancellationAction from "../action/impl/spell/cleric/protective/cancellationAction"
import fireproofAction from "../action/impl/spell/cleric/protective/fireproofAction"
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
import AbilityService from "../check/abilityService"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"

export default function getSpellTable(mobService: MobService, eventService: EventService): Spell[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    // maladictions
    new BlindAction(abilityService),
    new CurseAction(abilityService),
    new PoisonAction(abilityService),
    new WrathAction(abilityService),

    // healing
    new CureLightAction(abilityService),
    new CureSeriousAction(abilityService),
    new HealAction(abilityService),

    // curative
    new CurePoisonAction(abilityService),
    new RemoveCurseAction(abilityService),
    new FeastAction(abilityService),

    // enhancements
    new GiantStrengthAction(abilityService),
    new HasteAction(abilityService),

    // attack
    new MagicMissileAction(abilityService),
    new LightningBoltAction(abilityService),

    // protective
    new ShieldAction(abilityService),
    new StoneSkinAction(abilityService),
    new CancellationAction(abilityService),
    new SanctuaryAction(abilityService),
    new ProtectionGoodAction(abilityService),
    new ProtectionEvilAction(abilityService),
    new ProtectionNeutralAction(abilityService),
    fireproofAction(abilityService),

    // illusion
    new InvisibilityAction(abilityService),

    // detection
    new DetectInvisibleAction(abilityService),

    // piety
    blessAction(abilityService),
    crusadeAction(abilityService),

    // necromancy
    new SummonUndeadAction(abilityService, mobService),
    new TurnUndeadAction(abilityService, mobService),
    new DrawLifeAction(abilityService),

    // psionics
    new TowerOfIronWillAction(abilityService),
  ]
}
