import Spell from "../action/impl/spell"
import curePoisonAction from "../action/impl/spell/cleric/curative/curePoisonAction"
import feastAction from "../action/impl/spell/cleric/curative/feastAction"
import removeCurseAction from "../action/impl/spell/cleric/curative/removeCurseAction"
import cureLightAction from "../action/impl/spell/cleric/healing/cureLightAction"
import cureSeriousAction from "../action/impl/spell/cleric/healing/cureSeriousAction"
import healAction from "../action/impl/spell/cleric/healing/healAction"
import blessAction from "../action/impl/spell/cleric/piety/blessAction"
import crusadeAction from "../action/impl/spell/cleric/piety/crusadeAction"
import holySilenceAction from "../action/impl/spell/cleric/piety/holySilenceAction"
import cancellationAction from "../action/impl/spell/cleric/protective/cancellationAction"
import fireproofAction from "../action/impl/spell/cleric/protective/fireproofAction"
import protectionEvilAction from "../action/impl/spell/cleric/protective/protectionEvilAction"
import protectionGoodAction from "../action/impl/spell/cleric/protective/protectionGoodAction"
import protectionNeutralAction from "../action/impl/spell/cleric/protective/protectionNeutralAction"
import sanctuaryAction from "../action/impl/spell/cleric/protective/sanctuaryAction"
import shieldAction from "../action/impl/spell/cleric/protective/shieldAction"
import stoneSkinAction from "../action/impl/spell/cleric/protective/stoneSkinAction"
import psionicBlastAction from "../action/impl/spell/cleric/psionics/psionicBlastAction"
import towerOfIronWillAction from "../action/impl/spell/cleric/psionics/towerOfIronWillAction"
import lightningBoltAction from "../action/impl/spell/mage/attack/lightningBoltAction"
import magicMissileAction from "../action/impl/spell/mage/attack/magicMissileAction"
import detectInvisibleAction from "../action/impl/spell/mage/detection/detectInvisibleAction"
import giantStrengthAction from "../action/impl/spell/mage/enhancement/giantStrengthAction"
import hasteAction from "../action/impl/spell/mage/enhancement/hasteAction"
import invisibilityAction from "../action/impl/spell/mage/illusion/invisibilityAction"
import blindAction from "../action/impl/spell/mage/maladiction/blindAction"
import curseAction from "../action/impl/spell/mage/maladiction/curseAction"
import poisonAction from "../action/impl/spell/mage/maladiction/poisonAction"
import wrathAction from "../action/impl/spell/mage/maladiction/wrathAction"
import drawLifeAction from "../action/impl/spell/mage/necromancy/drawLifeAction"
import summonUndeadAction from "../action/impl/spell/mage/necromancy/summonUndeadAction"
import turnUndeadAction from "../action/impl/spell/mage/necromancy/turnUndeadAction"
import withstandDeathAction from "../action/impl/spell/mage/necromancy/withstandDeathAction"
import AbilityService from "../check/abilityService"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"

export default function getSpellTable(mobService: MobService, eventService: EventService): Spell[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    // maladictions
    blindAction(abilityService),
    curseAction(abilityService),
    poisonAction(abilityService),
    wrathAction(abilityService),

    // healing
    cureLightAction(abilityService),
    cureSeriousAction(abilityService),
    healAction(abilityService),

    // curative
    curePoisonAction(abilityService),
    removeCurseAction(abilityService),
    feastAction(abilityService),

    // enhancements
    giantStrengthAction(abilityService),
    hasteAction(abilityService),

    // attack
    magicMissileAction(abilityService),
    lightningBoltAction(abilityService),

    // protective
    shieldAction(abilityService),
    stoneSkinAction(abilityService),
    cancellationAction(abilityService),
    sanctuaryAction(abilityService),
    protectionGoodAction(abilityService),
    protectionEvilAction(abilityService),
    protectionNeutralAction(abilityService),
    fireproofAction(abilityService),

    // illusion
    invisibilityAction(abilityService),

    // detection
    detectInvisibleAction(abilityService),

    // piety
    blessAction(abilityService),
    crusadeAction(abilityService),
    holySilenceAction(abilityService),

    // necromancy
    summonUndeadAction(abilityService, mobService),
    turnUndeadAction(abilityService, mobService),
    drawLifeAction(abilityService),
    withstandDeathAction(abilityService),

    // psionics
    towerOfIronWillAction(abilityService),
    psionicBlastAction(abilityService),
  ]
}
