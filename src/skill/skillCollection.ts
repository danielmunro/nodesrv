import { Trigger } from "../mob/trigger"
import roll from "../random/dice"
import backstab from "./actions/backstab"
import bash from "./actions/bash"
import berserk from "./actions/berserk"
import dirtKick from "./actions/dirtKick"
import disarm from "./actions/disarm"
import dodge from "./actions/dodge"
import enhancedDamage from "./actions/enhancedDamage"
import envenom from "./actions/envenom"
import secondAttack from "./actions/secondAttack"
import sneak from "./actions/sneak"
import trip from "./actions/trip"
import backstabPrecondition from "./preconditions/backstab"
import bashPrecondition from "./preconditions/bash"
import berserkPrecondition from "./preconditions/berserk"
import dirtKickPrecondition from "./preconditions/dirtKick"
import disarmPrecondition from "./preconditions/disarm"
import envenomPrecondition from "./preconditions/envenom"
import secondAttackPrecondition from "./preconditions/secondAttack"
import sneakPrecondition from "./preconditions/sneak"
import tripPrecondition from "./preconditions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"
import Response from "../request/response"
import CheckedRequest from "../check/checkedRequest"
import { CheckType } from "../check/checkType"
import { Skill } from "./model/skill"

const BASE_IMPROVE_CHANCE = 50
const SLOW_IMPROVE_CHANCE = 10

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
    const checkedRequest = response.request as CheckedRequest
    const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill) as Skill
    skill.level++
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
    createCheckImprove((attempt) => attempt),
    1)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, Trigger.AttackRoundDefend,
    createCheckImprove(dodge, SLOW_IMPROVE_CHANCE), 10),
  createSkill(SkillType.Disarm, Trigger.Input,
    createCheckImprove(disarm), 10, disarmPrecondition),
  // re-add createCheckImprove when refactoring is complete
  createSkill(SkillType.SecondAttack, Trigger.AttackRound,
    secondAttack, 10),
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
    createCheckImprove(enhancedDamage), 30),
  createSkill(SkillType.DirtKick, Trigger.Input,
    createCheckImprove(dirtKick), 5, dirtKickPrecondition),
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

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
