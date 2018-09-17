import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { Costs, MESSAGE_BERSERK_FAIL, MESSAGE_BERSERK_SUCCESS } from "./constants"

const SUCCESS_THRESHOLD = 60

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateBerserkRoll(attempt.mob, attempt.skill) > SUCCESS_THRESHOLD) {
    attempt.mob.addAffect(newAffect(AffectType.Berserk, attempt.mob.level / 10))
    return new Outcome(attempt, OutcomeType.Success, MESSAGE_BERSERK_SUCCESS, Costs.Berserk.Delay)
  }

  return new Outcome(attempt, OutcomeType.Failure, MESSAGE_BERSERK_FAIL, Costs.Berserk.Delay)
}

function calculateBerserkRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level)
}
