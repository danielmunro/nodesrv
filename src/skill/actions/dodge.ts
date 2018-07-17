import roll from "../../random/dice"
import { Mob } from "../../mob/model/mob"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateDodgeRoll(attempt.mob, attempt.skill) > calculateHitRoll(attempt.target)) {
    return new Outcome(attempt, OutcomeType.Success, "you dodged!")
  }

  return new Outcome(attempt, OutcomeType.Failure, "you failed")
}

function calculateHitRoll(mob: Mob): number {
  const attrs = mob.getCombinedAttributes()
  return roll(1, attrs.stats.dex) + roll(1, attrs.hitroll.hit)
}

function calculateDodgeRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level)
}
