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
  return service.createSkillDefinition(
    skillType,
    Trigger.DamageModifier,
    request => request)
}

export function getSkillTable(service: GameService) {
  return [
    service.createSkillDefinition(SkillType.Dodge, Trigger.AttackRoundDefend, dodge, dodgePrecondition),
    service.createSkillDefinition(SkillType.Disarm, Trigger.Input, disarm, disarmPrecondition),
    service.createSkillDefinition(SkillType.SecondAttack, Trigger.AttackRound, secondAttack, secondAttackPrecondition),
    service.createSkillDefinition(SkillType.Bash, Trigger.Input, bash, bashPrecondition),
    service.createSkillDefinition(SkillType.Trip, Trigger.Input, trip, tripPrecondition),
    service.createSkillDefinition(SkillType.Berserk, Trigger.Input, berserk, berserkPrecondition),
    service.createSkillDefinition(SkillType.Sneak, Trigger.Input, sneak, sneakPrecondition),
    service.createSkillDefinition(SkillType.Envenom, Trigger.Input, envenom, envenomPrecondition),
    service.createSkillDefinition(SkillType.Backstab, Trigger.Input, backstab, backstabPrecondition),
    service.createSkillDefinition(SkillType.EnhancedDamage, Trigger.DamageModifier,
      enhancedDamage, enhancedDamagePrecondition),
    service.createSkillDefinition(SkillType.DirtKick, Trigger.Input, dirtKick, dirtKickPrecondition),
    service.createSkillDefinition(SkillType.FastHealing, Trigger.Tick, fastHealing, fastHealingPrecondition),
    service.createSkillDefinition(SkillType.Steal, Trigger.Input, steal, stealPrecondition),
    service.createSkillDefinition(SkillType.Sharpen, Trigger.Input, sharpen, sharpenPrecondition),
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
  return (await getSkillTable(service)).find(action => action.isSkillTypeMatch(skillType))
}
