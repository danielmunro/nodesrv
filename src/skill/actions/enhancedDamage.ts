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
  const stats = mob.getCombinedAttributes().stats
  return roll(3, Math.max(1, stats.str / 6))
    + roll(3, Math.max(1, stats.sta / 10) + 1)
    + roll(4, Math.max(1, skill.level / 20) + 1)
    + 40
}
