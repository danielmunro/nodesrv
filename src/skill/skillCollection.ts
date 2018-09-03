import { Trigger } from "../mob/trigger"
import bashAction from "./actions/bash"
import berserkAction from "./actions/berserk"
import dodgeAction from "./actions/dodge"
import sneakAction from "./actions/sneak"
import tripAction from "./actions/trip"
import bashPrecondition from "./preconditions/bash"
import berserkPrecondition from "./preconditions/berserk"
import sneakPrecondition from "./preconditions/sneak"
import tripPrecondition from "./preconditions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"
import Outcome from "./outcome"
import roll from "../random/dice"

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

function checkImprove(outcome: Outcome, baseImproveChance: number = BASE_IMPROVE_CHANCE) {
  let it = initialImproveRoll()
  if (outcome.wasSuccessful()) {
    it += successModifierRoll()
  }
  if (it <= baseImproveChance) {
    outcome.setImprovement(true)
    outcome.attempt.skill.level++
  }
  return outcome
}

function createCheckImprove(method, improveChance = BASE_IMPROVE_CHANCE) {
  return async (attempt) => checkImprove( await method(attempt), improveChance)
}

function newWeaponSkill(skillType: SkillType) {
  return createSkill(
    skillType,
    Trigger.AttackRoundDamage,
    createCheckImprove((attempt) => attempt),
    1)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, Trigger.AttackRoundStart,
    createCheckImprove(dodgeAction, SLOW_IMPROVE_CHANCE), 10),
  createSkill(SkillType.Bash, Trigger.Input,
    createCheckImprove(bashAction), 5, bashPrecondition),
  createSkill(SkillType.Trip, Trigger.Input,
    createCheckImprove(tripAction), 10, tripPrecondition),
  createSkill(SkillType.Berserk, Trigger.Input,
    createCheckImprove(berserkAction), 20, berserkPrecondition),
  createSkill(SkillType.Sneak, Trigger.Input,
    createCheckImprove(sneakAction), 20, sneakPrecondition),
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
