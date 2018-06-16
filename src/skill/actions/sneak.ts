import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../dice/dice"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

const SUCCESS_THRESHOLD = 50
const DELAY = 1
export const MESSAGE_SNEAK_SUCCESS = "You begin to move silently."
export const MESSAGE_SNEAK_FAIL = "You fail to move silently."

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateSneakRoll(attempt.mob, attempt.skill) > SUCCESS_THRESHOLD) {
    attempt.mob.addAffect(newAffect(AffectType.Sneak, attempt.mob.level))
    return new Outcome(attempt, OutcomeType.Success, MESSAGE_SNEAK_SUCCESS, DELAY)
  }

  return new Outcome(attempt, OutcomeType.Failure, MESSAGE_SNEAK_FAIL, DELAY)
}

function calculateSneakRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level) - getSizeModifier(mob.race, 10, -10)
}
