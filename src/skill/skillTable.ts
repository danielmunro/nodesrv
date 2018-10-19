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
import { BASE_IMPROVE_CHANCE } from "./constants"
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
import stealPrecondition from "./preconditions/steal"
import tripPrecondition from "./preconditions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"
import steal from "./actions/steal"

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
