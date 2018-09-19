import Attempt from "../attempt"
import { Costs } from "../constants"
import Outcome from "../outcome"
import { OutcomeType } from "../outcomeType"

export default async function(attempt: Attempt): Promise<Outcome> {
  return new Outcome(
    attempt,
    OutcomeType.Success,
    `You backstab ${attempt.getSubjectAsMob().name}!`,
    Costs.Backstab.Delay)
}
