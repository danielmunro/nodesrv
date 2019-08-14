import acidBlastAction from "../../../action/impl/spell/attack/acidBlastAction"
import chillTouchAction from "../../../action/impl/spell/attack/chillTouchAction"
import fireballAction from "../../../action/impl/spell/attack/fireballAction"
import lightningBoltAction from "../../../action/impl/spell/attack/lightningBoltAction"
import magicMissileAction from "../../../action/impl/spell/attack/magicMissileAction"
import curePoisonAction from "../../../action/impl/spell/curative/curePoisonAction"
import feastAction from "../../../action/impl/spell/curative/feastAction"
import removeCurseAction from "../../../action/impl/spell/curative/removeCurseAction"
import detectHiddenAction from "../../../action/impl/spell/detection/detectHiddenAction"
import detectInvisibleAction from "../../../action/impl/spell/detection/detectInvisibleAction"
import knowAlignmentAction from "../../../action/impl/spell/detection/knowAlignmentAction"
import locateItemAction from "../../../action/impl/spell/detection/locateItemAction"
import giantStrengthAction from "../../../action/impl/spell/enhancement/giantStrengthAction"
import hasteAction from "../../../action/impl/spell/enhancement/hasteAction"
import refreshAction from "../../../action/impl/spell/enhancement/refreshAction"
import cureLightAction from "../../../action/impl/spell/healing/cureLightAction"
import cureSeriousAction from "../../../action/impl/spell/healing/cureSeriousAction"
import healAction from "../../../action/impl/spell/healing/healAction"
import invisibilityAction from "../../../action/impl/spell/illusion/invisibilityAction"
import blindAction from "../../../action/impl/spell/maladiction/blindAction"
import curseAction from "../../../action/impl/spell/maladiction/curseAction"
import poisonAction from "../../../action/impl/spell/maladiction/poisonAction"
import slowAction from "../../../action/impl/spell/maladiction/slowAction"
import wrathAction from "../../../action/impl/spell/maladiction/wrathAction"
import drawLifeAction from "../../../action/impl/spell/necromancy/drawLifeAction"
import summonUndeadAction from "../../../action/impl/spell/necromancy/summonUndeadAction"
import turnUndeadAction from "../../../action/impl/spell/necromancy/turnUndeadAction"
import withstandDeathAction from "../../../action/impl/spell/necromancy/withstandDeathAction"
import orbOfAwakeningAction from "../../../action/impl/spell/orb/orbOfAwakeningAction"
import orbOfTouchAction from "../../../action/impl/spell/orb/orbOfTouchAction"
import blessAction from "../../../action/impl/spell/piety/blessAction"
import crusadeAction from "../../../action/impl/spell/piety/crusadeAction"
import holySilenceAction from "../../../action/impl/spell/piety/holySilenceAction"
import cancellationAction from "../../../action/impl/spell/protective/cancellationAction"
import fireproofAction from "../../../action/impl/spell/protective/fireproofAction"
import protectionEvilAction from "../../../action/impl/spell/protective/protectionEvilAction"
import protectionGoodAction from "../../../action/impl/spell/protective/protectionGoodAction"
import protectionNeutralAction from "../../../action/impl/spell/protective/protectionNeutralAction"
import sanctuaryAction from "../../../action/impl/spell/protective/sanctuaryAction"
import shieldAction from "../../../action/impl/spell/protective/shieldAction"
import stoneSkinAction from "../../../action/impl/spell/protective/stoneSkinAction"
import psionicBlastAction from "../../../action/impl/spell/psionics/psionicBlastAction"
import towerOfIronWillAction from "../../../action/impl/spell/psionics/towerOfIronWillAction"
import flyAction from "../../../action/impl/spell/transportation/flyAction"
import summonAction from "../../../action/impl/spell/transportation/summonAction"
import wordOfRecallAction from "../../../action/impl/spell/transportation/wordOfRecallAction"

export const spells = [
  // maladictions
  blindAction,
  curseAction,
  poisonAction,
  wrathAction,
  slowAction,

  // healing
  cureLightAction,
  cureSeriousAction,
  healAction,

  // curative
  curePoisonAction,
  removeCurseAction,
  feastAction,

  // enhancements
  giantStrengthAction,
  hasteAction,
  refreshAction,

  // attack
  magicMissileAction,
  lightningBoltAction,
  acidBlastAction,
  chillTouchAction,
  fireballAction,

  // protective
  shieldAction,
  stoneSkinAction,
  cancellationAction,
  sanctuaryAction,
  protectionGoodAction,
  protectionEvilAction,
  protectionNeutralAction,
  fireproofAction,

  // illusion
  invisibilityAction,

  // detection
  detectInvisibleAction,
  detectHiddenAction,
  locateItemAction,
  knowAlignmentAction,

  // piety
  blessAction,
  crusadeAction,
  holySilenceAction,

  // psionics
  towerOfIronWillAction,
  psionicBlastAction,

  // transportation
  flyAction,
  wordOfRecallAction,
  summonAction,

  // orbs
  orbOfTouchAction,
  orbOfAwakeningAction,

  // necromancy
  summonUndeadAction,
  turnUndeadAction,
  drawLifeAction,
  withstandDeathAction,
]
