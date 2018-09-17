import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { MESSAGE_SNEAK_FAIL, MESSAGE_SNEAK_SUCCESS } from "./constants"

const SUCCESS_THRESHOLD = 50
const DELAY = 1

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
