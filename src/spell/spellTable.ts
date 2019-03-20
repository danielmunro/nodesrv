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
import protectionEvilAction from "../action/impl/spell/cleric/protective/protectionEvilAction"
import protectionGoodAction from "../action/impl/spell/cleric/protective/protectionGoodAction"
import protectionNeutralAction from "../action/impl/spell/cleric/protective/protectionNeutralAction"
import sanctuaryAction from "../action/impl/spell/cleric/protective/sanctuaryAction"
import shieldAction from "../action/impl/spell/cleric/protective/shieldAction"
import stoneSkinAction from "../action/impl/spell/cleric/protective/stoneSkinAction"
import towerOfIronWillAction from "../action/impl/spell/cleric/psionics/towerOfIronWillAction"
import LightningBoltAction from "../action/impl/spell/mage/attack/lightningBoltAction"
import MagicMissileAction from "../action/impl/spell/mage/attack/magicMissileAction"
import DetectInvisibleAction from "../action/impl/spell/mage/detection/detectInvisibleAction"
import GiantStrengthAction from "../action/impl/spell/mage/enhancement/giantStrengthAction"
import HasteAction from "../action/impl/spell/mage/enhancement/hasteAction"
import InvisibilityAction from "../action/impl/spell/mage/illusion/invisibilityAction"
import BlindAction from "../action/impl/spell/mage/maladiction/blindAction"
import curseAction from "../action/impl/spell/mage/maladiction/curseAction"
import poisonAction from "../action/impl/spell/mage/maladiction/poisonAction"
import wrathAction from "../action/impl/spell/mage/maladiction/wrathAction"
import DrawLifeAction from "../action/impl/spell/mage/necromancy/drawLifeAction"
import SummonUndeadAction from "../action/impl/spell/mage/necromancy/summonUndeadAction"
import TurnUndeadAction from "../action/impl/spell/mage/necromancy/turnUndeadAction"
import withstandDeathAction from "../action/impl/spell/mage/necromancy/withstandDeathAction"
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
    curseAction(abilityService),
    poisonAction(abilityService),
    wrathAction(abilityService),

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
    shieldAction(abilityService),
    stoneSkinAction(abilityService),
    new CancellationAction(abilityService),
    sanctuaryAction(abilityService),
    protectionGoodAction(abilityService),
    protectionEvilAction(abilityService),
    protectionNeutralAction(abilityService),
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
    withstandDeathAction(abilityService),

    // psionics
    towerOfIronWillAction(abilityService),
  ]
}
