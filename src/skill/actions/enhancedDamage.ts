import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { SuccessThreshold } from "../constants"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateEnhancedDamageRoll(attempt.mob, attempt.skill) > SuccessThreshold.EnhancedDamage) {
    return new Outcome(attempt, OutcomeType.Success)
  }

  return new Outcome(attempt, OutcomeType.Failure)
}

function calculateEnhancedDamageRoll(mob: Mob, skill: Skill): number {
  return roll(6, mob.getCombinedAttributes().stats.str / 5)
    + roll(10, skill.level / 10)
}
