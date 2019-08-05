import backstabAction from "../../../action/impl/skill/assassin/backstabAction"
import envenomAction from "../../../action/impl/skill/assassin/envenomAction"
import eyeGougeAction from "../../../action/impl/skill/assassin/eyeGougeAction"
import garotteAction from "../../../action/impl/skill/assassin/garotteAction"
import gougeAction from "../../../action/impl/skill/assassin/gougeAction"
import hamstringAction from "../../../action/impl/skill/assassin/hamstringAction"
import tripAction from "../../../action/impl/skill/assassin/tripAction"
import bashAction from "../../../action/impl/skill/brawler/bashAction"
import bludgeonAction from "../../../action/impl/skill/brawler/bludgeonAction"
import cleaveAction from "../../../action/impl/skill/brawler/cleaveAction"
import enhancedDamageAction from "../../../action/impl/skill/brawler/enhancedDamageAction"
import secondAttackAction from "../../../action/impl/skill/brawler/secondAttackAction"
import shieldBashAction from "../../../action/impl/skill/brawler/shieldBashAction"
import thirdAttackAction from "../../../action/impl/skill/brawler/thirdAttackAction"
import sharpenAction from "../../../action/impl/skill/crafting/sharpenAction"
import detectHiddenAction from "../../../action/impl/skill/detection/detectHiddenAction"
import detectTouchAction from "../../../action/impl/skill/detection/detectTouchAction"
import enduranceAction from "../../../action/impl/skill/endurance/enduranceAction"
import fastHealingAction from "../../../action/impl/skill/endurance/fastHealingAction"
import dirtKickAction from "../../../action/impl/skill/evasion/dirtKickAction"
import dodgeAction from "../../../action/impl/skill/evasion/dodgeAction"
import parryAction from "../../../action/impl/skill/evasion/parryAction"
import shieldBlockAction from "../../../action/impl/skill/evasion/shieldBlockAction"
import peekAction from "../../../action/impl/skill/thief/peekAction"
import sneakAction from "../../../action/impl/skill/thief/sneakAction"
import stealAction from "../../../action/impl/skill/thief/stealAction"
import berserkAction from "../../../action/impl/skill/warrior/berserkAction"
import disarmAction from "../../../action/impl/skill/warrior/disarmAction"

export const skills = [
  // passive fighting
  dodgeAction,
  secondAttackAction,
  thirdAttackAction,
  enhancedDamageAction,
  fastHealingAction,
  shieldBlockAction,
  parryAction,

  // actions
  backstabAction,
  dirtKickAction,
  envenomAction,
  hamstringAction,
  sharpenAction,
  sneakAction,
  stealAction,
  peekAction,
  garotteAction,
  detectHiddenAction,
  detectTouchAction,
  eyeGougeAction,
  bashAction,
  berserkAction,
  disarmAction,
  shieldBashAction,
  tripAction,
  bludgeonAction,
  cleaveAction,
  gougeAction,
  enduranceAction,
]
