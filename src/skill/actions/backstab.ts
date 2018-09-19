import Attempt from "../attempt"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"
import { Costs } from "../constants"

export default async function(attempt: Attempt): Promise<Outcome> {
  return new Outcome(
    attempt,
    OutcomeType.Success,
    `You backstab ${attempt.getSubjectAsMob().name}!`,
    Costs.Backstab.Delay)
}
