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
import Attempt from "./attempt"
import Outcome from "./outcome"
import roll from "../random/dice"

const BASE_IMPROVE_CHANCE = 50
const SLOW_IMPROVE_CHANCE = 10

function createSkill(type: SkillType, triggers: Trigger[], action, preconditions = null): SkillDefinition {
  return new SkillDefinition(type, triggers, action, preconditions)
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

export const skillCollection = [
  createSkill(
    SkillType.Dodge,
    [Trigger.AttackRoundStart],
    async (attempt) => checkImprove(await dodgeAction(attempt)), SLOW_IMPROVE_CHANCE),
  createSkill(
    SkillType.Bash,
    [Trigger.Input],
    async (attempt) => checkImprove(await bashAction(attempt)),
    bashPrecondition),
  createSkill(
    SkillType.Trip,
    [Trigger.Input],
    async (attempt) => checkImprove(await tripAction(attempt)),
    tripPrecondition),
  createSkill(
    SkillType.Berserk,
    [Trigger.Input],
    async (attempt) => checkImprove(await berserkAction(attempt)),
    berserkPrecondition),
  createSkill(
    SkillType.Sneak,
    [Trigger.Input],
    async (attempt) => checkImprove(await sneakAction(attempt)),
    sneakPrecondition),
  // createSkill(SkillType.Sword, [Trigger.AttackRoundDamage], (attempt: Attempt) =>
  //   checkWeaponSkillImprovement(attempt, SkillType.Sword)),
]

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
