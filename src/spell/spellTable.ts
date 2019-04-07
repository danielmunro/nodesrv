import Spell from "../action/impl/spell"
import lightningBoltAction from "../action/impl/spell/attack/lightningBoltAction"
import magicMissileAction from "../action/impl/spell/attack/magicMissileAction"
import curePoisonAction from "../action/impl/spell/curative/curePoisonAction"
import feastAction from "../action/impl/spell/curative/feastAction"
import removeCurseAction from "../action/impl/spell/curative/removeCurseAction"
import detectHiddenAction from "../action/impl/spell/detection/detectHiddenAction"
import detectInvisibleAction from "../action/impl/spell/detection/detectInvisibleAction"
import knowAlignmentAction from "../action/impl/spell/detection/knowAlignmentAction"
import locateItemAction from "../action/impl/spell/detection/locateItemAction"
import giantStrengthAction from "../action/impl/spell/enhancement/giantStrengthAction"
import hasteAction from "../action/impl/spell/enhancement/hasteAction"
import refreshAction from "../action/impl/spell/enhancement/refreshAction"
import cureLightAction from "../action/impl/spell/healing/cureLightAction"
import cureSeriousAction from "../action/impl/spell/healing/cureSeriousAction"
import healAction from "../action/impl/spell/healing/healAction"
import invisibilityAction from "../action/impl/spell/illusion/invisibilityAction"
import blindAction from "../action/impl/spell/maladiction/blindAction"
import curseAction from "../action/impl/spell/maladiction/curseAction"
import poisonAction from "../action/impl/spell/maladiction/poisonAction"
import wrathAction from "../action/impl/spell/maladiction/wrathAction"
import drawLifeAction from "../action/impl/spell/necromancy/drawLifeAction"
import summonUndeadAction from "../action/impl/spell/necromancy/summonUndeadAction"
import turnUndeadAction from "../action/impl/spell/necromancy/turnUndeadAction"
import withstandDeathAction from "../action/impl/spell/necromancy/withstandDeathAction"
import blessAction from "../action/impl/spell/piety/blessAction"
import crusadeAction from "../action/impl/spell/piety/crusadeAction"
import holySilenceAction from "../action/impl/spell/piety/holySilenceAction"
import cancellationAction from "../action/impl/spell/protective/cancellationAction"
import fireproofAction from "../action/impl/spell/protective/fireproofAction"
import protectionEvilAction from "../action/impl/spell/protective/protectionEvilAction"
import protectionGoodAction from "../action/impl/spell/protective/protectionGoodAction"
import protectionNeutralAction from "../action/impl/spell/protective/protectionNeutralAction"
import sanctuaryAction from "../action/impl/spell/protective/sanctuaryAction"
import shieldAction from "../action/impl/spell/protective/shieldAction"
import stoneSkinAction from "../action/impl/spell/protective/stoneSkinAction"
import psionicBlastAction from "../action/impl/spell/psionics/psionicBlastAction"
import towerOfIronWillAction from "../action/impl/spell/psionics/towerOfIronWillAction"
import flyAction from "../action/impl/spell/transportation/flyAction"
import wordOfRecallAction from "../action/impl/spell/transportation/wordOfRecallAction"
import AbilityService from "../check/abilityService"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import StateService from "../gameService/stateService"
import ItemService from "../item/itemService"
import MobService from "../mob/mobService"

export default function getSpellTable(
  mobService: MobService,
  eventService: EventService,
  itemService: ItemService,
  stateService: StateService): Spell[] {
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
    refreshAction(abilityService),

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
    detectHiddenAction(abilityService),
    locateItemAction(abilityService, itemService, stateService),
    knowAlignmentAction(abilityService),

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

    // transportation
    flyAction(abilityService),
    wordOfRecallAction(abilityService, mobService.locationService),
  ]
}
