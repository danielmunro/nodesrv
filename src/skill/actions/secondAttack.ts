import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import roll from "../../random/dice"

function isSecondAttackInvoked(attempt: Attempt) {
  return roll(1, attempt.skill.level) > attempt.target.level
}

export default async function(attempt: Attempt): Promise<Outcome> {
  if (isSecondAttackInvoked(attempt)) {
    return new Outcome(attempt, OutcomeType.Success)
  }

  return new Outcome(attempt, OutcomeType.Failure)
}
