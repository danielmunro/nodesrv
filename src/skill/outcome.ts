import Attempt from "./attempt"
import { OutcomeType } from "./outcomeType"

export default class Outcome {
  public readonly attempt: Attempt
  public readonly outcomeType: OutcomeType
  public readonly message: string

  constructor(attempt: Attempt, outcomeType: OutcomeType, message: string) {
    this.attempt = attempt
    this.outcomeType = outcomeType
    this.message = message
  }

  public wasSuccessful(): boolean {
    return this.outcomeType === OutcomeType.Success
  }
}
