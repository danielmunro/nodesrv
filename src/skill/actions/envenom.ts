import roll from "../../random/dice"
import Attempt from "../attempt"
import Outcome from "../outcome"

import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"

export default async function(attempt: Attempt): Promise<Outcome> {
  const item = attempt.getSubjectAsItem()
  if (roll(1, attempt.skill.level) > item.level) {
    item.affects.push(newAffect(AffectType.Poison, attempt.mob.level))
    return attempt.createSuccessOutcome()
  }

  return attempt.createFailureOutcome()
}
