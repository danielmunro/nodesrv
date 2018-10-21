import { CheckType } from "../check/checkType"
import { Trigger } from "../mob/trigger"
import roll from "../random/dice"
import Response from "../request/response"
import backstab from "./action/backstab"
import bash from "./action/bash"
import berserk from "./action/berserk"
import dirtKick from "./action/dirtKick"
import disarm from "./action/disarm"
import dodge from "./action/dodge"
import enhancedDamage from "./action/enhancedDamage"
import envenom from "./action/envenom"
import fastHealing from "./action/fastHealing"
import secondAttack from "./action/secondAttack"
import sharpen from "./action/sharpen"
import sneak from "./action/sneak"
import steal from "./action/steal"
import trip from "./action/trip"
import { BASE_IMPROVE_CHANCE } from "./constants"
import backstabPrecondition from "./precondition/backstab"
import bashPrecondition from "./precondition/bash"
import berserkPrecondition from "./precondition/berserk"
import dirtKickPrecondition from "./precondition/dirtKick"
import disarmPrecondition from "./precondition/disarm"
import dodgePrecondition from "./precondition/dodge"
import enhancedDamagePrecondition from "./precondition/enhancedDamage"
import envenomPrecondition from "./precondition/envenom"
import fastHealingPrecondition from "./precondition/fastHealing"
import secondAttackPrecondition from "./precondition/secondAttack"
import sharpenPrecondition from "./precondition/sharpen"
import sneakPrecondition from "./precondition/sneak"
import stealPrecondition from "./precondition/steal"
import tripPrecondition from "./precondition/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

function createSkill(
  type: SkillType, trigger: Trigger, action, preconditions = null): SkillDefinition {
  return new SkillDefinition(type, [trigger], action, preconditions)
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

function improve(method, improveChance = BASE_IMPROVE_CHANCE) {
  return async request => checkImprove(await method(request), improveChance)
}

function newWeaponSkill(skillType: SkillType) {
  return createSkill(
    skillType,
    Trigger.DamageModifier,
    improve(request => request))
}

export const skillTable = [
  createSkill(SkillType.Dodge, Trigger.AttackRoundDefend, improve(dodge), dodgePrecondition),
  createSkill(SkillType.Disarm, Trigger.Input, improve(disarm), disarmPrecondition),
  createSkill(SkillType.SecondAttack, Trigger.AttackRound,
    improve(secondAttack), secondAttackPrecondition),
  createSkill(SkillType.Bash, Trigger.Input, improve(bash), bashPrecondition),
  createSkill(SkillType.Trip, Trigger.Input, improve(trip), tripPrecondition),
  createSkill(SkillType.Berserk, Trigger.Input, improve(berserk), berserkPrecondition),
  createSkill(SkillType.Sneak, Trigger.Input, improve(sneak), sneakPrecondition),
  createSkill(SkillType.Envenom, Trigger.Input, improve(envenom), envenomPrecondition),
  createSkill(SkillType.Backstab, Trigger.Input, improve(backstab), backstabPrecondition),
  createSkill(SkillType.EnhancedDamage, Trigger.DamageModifier,
    improve(enhancedDamage), enhancedDamagePrecondition),
  createSkill(SkillType.DirtKick, Trigger.Input, improve(dirtKick), dirtKickPrecondition),
  createSkill(SkillType.FastHealing, Trigger.Tick, improve(fastHealing), fastHealingPrecondition),
  createSkill(SkillType.Steal, Trigger.Input, improve(steal), stealPrecondition),
  createSkill(SkillType.Sharpen, Trigger.Input, improve(sharpen), sharpenPrecondition),
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
  return skillTable.find((action) => action.isSkillTypeMatch(skillType))
}
