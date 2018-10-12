import { CheckType } from "../check/checkType"
import { Trigger } from "../mob/trigger"
import roll from "../random/dice"
import Response from "../request/response"
import backstab from "./actions/backstab"
import bash from "./actions/bash"
import berserk from "./actions/berserk"
import dirtKick from "./actions/dirtKick"
import disarm from "./actions/disarm"
import dodge from "./actions/dodge"
import enhancedDamage from "./actions/enhancedDamage"
import envenom from "./actions/envenom"
import fastHealing from "./actions/fastHealing"
import secondAttack from "./actions/secondAttack"
import sneak from "./actions/sneak"
import trip from "./actions/trip"
import backstabPrecondition from "./preconditions/backstab"
import bashPrecondition from "./preconditions/bash"
import berserkPrecondition from "./preconditions/berserk"
import dirtKickPrecondition from "./preconditions/dirtKick"
import disarmPrecondition from "./preconditions/disarm"
import dodgePrecondition from "./preconditions/dodge"
import enhancedDamagePrecondition from "./preconditions/enhancedDamage"
import envenomPrecondition from "./preconditions/envenom"
import fastHealingPrecondition from "./preconditions/fastHealing"
import secondAttackPrecondition from "./preconditions/secondAttack"
import sneakPrecondition from "./preconditions/sneak"
import tripPrecondition from "./preconditions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

const BASE_IMPROVE_CHANCE = 50

function createSkill(
  type: SkillType, trigger: Trigger, action, minimumLevel: number, preconditions = null): SkillDefinition {
  return new SkillDefinition(type, [trigger], action, minimumLevel, preconditions)
}

function initialImproveRoll(): number {
  return roll(1, 1000)
}

function successModifierRoll(): number {
  return roll(5, 10)
}

function checkImprove(response: Response, baseImproveChance: number = BASE_IMPROVE_CHANCE) {
  let it = initialImproveRoll()
  if (response.isSuccessful()) {
    it += successModifierRoll()
  }
  if (it <= baseImproveChance) {
    response.getCheckedRequest().getCheckTypeResult(CheckType.HasSkill).level++
  }
  return response
}

function createCheckImprove(method, improveChance = BASE_IMPROVE_CHANCE) {
  return async request => checkImprove(await method(request), improveChance)
}

function newWeaponSkill(skillType: SkillType) {
  return createSkill(
    skillType,
    Trigger.DamageModifier,
    createCheckImprove(request => request),
    1)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, Trigger.AttackRoundDefend,
    createCheckImprove(dodge), 10, dodgePrecondition),
  createSkill(SkillType.Disarm, Trigger.Input,
    createCheckImprove(disarm), 10, disarmPrecondition),
  createSkill(SkillType.SecondAttack, Trigger.AttackRound,
    createCheckImprove(secondAttack), 10, secondAttackPrecondition),
  createSkill(SkillType.Bash, Trigger.Input,
    createCheckImprove(bash), 5, bashPrecondition),
  createSkill(SkillType.Trip, Trigger.Input,
    createCheckImprove(trip), 10, tripPrecondition),
  createSkill(SkillType.Berserk, Trigger.Input,
    createCheckImprove(berserk), 20, berserkPrecondition),
  createSkill(SkillType.Sneak, Trigger.Input,
    createCheckImprove(sneak), 6, sneakPrecondition),
  createSkill(SkillType.Envenom, Trigger.Input,
    createCheckImprove(envenom), 20, envenomPrecondition),
  createSkill(SkillType.Backstab, Trigger.Input,
    createCheckImprove(backstab), 20, backstabPrecondition),
  createSkill(SkillType.EnhancedDamage, Trigger.DamageModifier,
    createCheckImprove(enhancedDamage), 30, enhancedDamagePrecondition),
  createSkill(SkillType.DirtKick, Trigger.Input,
    createCheckImprove(dirtKick), 5, dirtKickPrecondition),
  createSkill(SkillType.FastHealing, Trigger.Tick,
    createCheckImprove(fastHealing), 5, fastHealingPrecondition),
  newWeaponSkill(SkillType.Sword),
  newWeaponSkill(SkillType.Mace),
  newWeaponSkill(SkillType.Wand),
  newWeaponSkill(SkillType.Dagger),
  newWeaponSkill(SkillType.Stave),
  newWeaponSkill(SkillType.Whip),
  newWeaponSkill(SkillType.Spear),
  newWeaponSkill(SkillType.Axe),
  newWeaponSkill(SkillType.Flail),
  newWeaponSkill(SkillType.Polearm),
]

export function getSkillActionDefinition(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
