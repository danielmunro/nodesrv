import GameService from "../gameService/gameService"
import { improveSkill } from "../improve/improve"
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
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

function createSkill(
  service: GameService, type: SkillType, trigger: Trigger, action, preconditions = null): SkillDefinition {
  return new SkillDefinition(service, type, [trigger], action, preconditions)
}

function newWeaponSkill(service: GameService, skillType: SkillType) {
  return createSkill(
    service,
    skillType,
    Trigger.DamageModifier,
    improveSkill(request => request))
}

export function getSkillTable(service: GameService) {
  return [
    createSkill(service, SkillType.Dodge, Trigger.AttackRoundDefend, improveSkill(dodge), dodgePrecondition),
    createSkill(service, SkillType.Disarm, Trigger.Input, improveSkill(disarm), disarmPrecondition),
    createSkill(service, SkillType.SecondAttack, Trigger.AttackRound,
      improveSkill(secondAttack), secondAttackPrecondition),
    createSkill(service, SkillType.Bash, Trigger.Input, improveSkill(bash), bashPrecondition),
    createSkill(service, SkillType.Trip, Trigger.Input, improveSkill(trip), tripPrecondition),
    createSkill(service, SkillType.Berserk, Trigger.Input, improveSkill(berserk), berserkPrecondition),
    createSkill(service, SkillType.Sneak, Trigger.Input, improveSkill(sneak), sneakPrecondition),
    createSkill(service, SkillType.Envenom, Trigger.Input, improveSkill(envenom), envenomPrecondition),
    createSkill(service, SkillType.Backstab, Trigger.Input, improveSkill(backstab), backstabPrecondition),
    createSkill(service, SkillType.EnhancedDamage, Trigger.DamageModifier,
      improveSkill(enhancedDamage), enhancedDamagePrecondition),
    createSkill(service, SkillType.DirtKick, Trigger.Input, improveSkill(dirtKick), dirtKickPrecondition),
    createSkill(service, SkillType.FastHealing, Trigger.Tick, improveSkill(fastHealing), fastHealingPrecondition),
    createSkill(service, SkillType.Steal, Trigger.Input, improveSkill(steal), stealPrecondition),
    createSkill(service, SkillType.Sharpen, Trigger.Input, improveSkill(sharpen), sharpenPrecondition),
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
