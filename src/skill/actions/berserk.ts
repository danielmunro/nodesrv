import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../random/dice"
import { Mob } from "../../mob/model/mob"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

const DELAY = 2
const SUCCESS_THRESHOLD = 60
export const MESSAGE_BERSERK_SUCCESS = "Your pulse speeds up as you are consumed by rage!"
export const MESSAGE_BERSERK_FAIL = "You fail to summon your inner rage."

export default async function(attempt: Attempt): Promise<Outcome> {
  if (calculateBerserkRoll(attempt.mob, attempt.skill) > SUCCESS_THRESHOLD) {
    attempt.mob.addAffect(newAffect(AffectType.Berserk, attempt.mob.level / 10))
    return new Outcome(attempt, OutcomeType.Success, MESSAGE_BERSERK_SUCCESS, DELAY)
  }

  return new Outcome(attempt, OutcomeType.Failure, MESSAGE_BERSERK_FAIL, DELAY)
}

function calculateBerserkRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level)
}
