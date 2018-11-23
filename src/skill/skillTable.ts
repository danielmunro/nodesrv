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
  type: SkillType, trigger: Trigger, action, preconditions = null): SkillDefinition {
  return new SkillDefinition(type, [trigger], action, preconditions)
}

function newWeaponSkill(skillType: SkillType) {
  return createSkill(
    skillType,
    Trigger.DamageModifier,
    improveSkill(request => request))
}

export const skillTable = [
  createSkill(SkillType.Dodge, Trigger.AttackRoundDefend, improveSkill(dodge), dodgePrecondition),
  createSkill(SkillType.Disarm, Trigger.Input, improveSkill(disarm), disarmPrecondition),
  createSkill(SkillType.SecondAttack, Trigger.AttackRound,
    improveSkill(secondAttack), secondAttackPrecondition),
  createSkill(SkillType.Bash, Trigger.Input, improveSkill(bash), bashPrecondition),
  createSkill(SkillType.Trip, Trigger.Input, improveSkill(trip), tripPrecondition),
  createSkill(SkillType.Berserk, Trigger.Input, improveSkill(berserk), berserkPrecondition),
  createSkill(SkillType.Sneak, Trigger.Input, improveSkill(sneak), sneakPrecondition),
  createSkill(SkillType.Envenom, Trigger.Input, improveSkill(envenom), envenomPrecondition),
  createSkill(SkillType.Backstab, Trigger.Input, improveSkill(backstab), backstabPrecondition),
  createSkill(SkillType.EnhancedDamage, Trigger.DamageModifier,
    improveSkill(enhancedDamage), enhancedDamagePrecondition),
  createSkill(SkillType.DirtKick, Trigger.Input, improveSkill(dirtKick), dirtKickPrecondition),
  createSkill(SkillType.FastHealing, Trigger.Tick, improveSkill(fastHealing), fastHealingPrecondition),
  createSkill(SkillType.Steal, Trigger.Input, improveSkill(steal), stealPrecondition),
  createSkill(SkillType.Sharpen, Trigger.Input, improveSkill(sharpen), sharpenPrecondition),
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
