import GameService from "../gameService/gameService"
import { Trigger } from "../mob/enum/trigger"
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
import { SkillType } from "./skillType"

function newWeaponSkill(service: GameService, skillType: SkillType) {
  return service.definition().skill(
    skillType,
    Trigger.DamageModifier,
    request => request.respondWith().success())
}

export function getSkillTable(service: GameService) {
  const definition = service.definition()
  return [
    definition.skill(SkillType.Dodge, Trigger.AttackRoundDefend, dodge, dodgePrecondition),
    definition.skill(SkillType.Disarm, Trigger.Input, disarm, disarmPrecondition),
    definition.skill(SkillType.SecondAttack, Trigger.AttackRound, secondAttack, secondAttackPrecondition),
    definition.skill(SkillType.Bash, Trigger.Input, bash, bashPrecondition),
    definition.skill(SkillType.Trip, Trigger.Input, trip, tripPrecondition),
    definition.skill(SkillType.Berserk, Trigger.Input, berserk, berserkPrecondition),
    definition.skill(SkillType.Sneak, Trigger.Input, sneak, sneakPrecondition),
    definition.skill(SkillType.Envenom, Trigger.Input, envenom, envenomPrecondition),
    definition.skill(SkillType.Backstab, Trigger.Input, backstab, backstabPrecondition),
    definition.skill(SkillType.EnhancedDamage, Trigger.DamageModifier,
      enhancedDamage, enhancedDamagePrecondition),
    definition.skill(SkillType.DirtKick, Trigger.Input, dirtKick, dirtKickPrecondition),
    definition.skill(SkillType.FastHealing, Trigger.Tick, fastHealing, fastHealingPrecondition),
    definition.skill(SkillType.Steal, Trigger.Input, steal, stealPrecondition),
    definition.skill(SkillType.Sharpen, Trigger.Input, sharpen, sharpenPrecondition),
    newWeaponSkill(service, SkillType.Sword),
    newWeaponSkill(service, SkillType.Mace),
    newWeaponSkill(service, SkillType.Wand),
    newWeaponSkill(service, SkillType.Dagger),
    newWeaponSkill(service, SkillType.Stave),
    newWeaponSkill(service, SkillType.Whip),
    newWeaponSkill(service, SkillType.Spear),
    newWeaponSkill(service, SkillType.Axe),
    newWeaponSkill(service, SkillType.Flail),
    newWeaponSkill(service, SkillType.Polearm),
  ]
}

export async function getSkillActionDefinition(service: GameService, skillType: SkillType) {
  return getSkillTable(service).find(action => action.isSkillTypeMatch(skillType))
}
