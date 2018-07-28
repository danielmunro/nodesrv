import Attempt from "./attempt"
import { OutcomeType } from "./outcomeType"

export default class Outcome {
  public readonly attempt: Attempt
  public readonly outcomeType: OutcomeType
  public readonly message: string
  public readonly delayIncurred: number

  constructor(attempt: Attempt, outcomeType: OutcomeType, message: string = "", delayIncurred: number = 0) {
    this.attempt = attempt
    this.outcomeType = outcomeType
    this.message = message
    this.delayIncurred = delayIncurred
  }

  public wasSuccessful(): boolean {
    return this.outcomeType === OutcomeType.Success
  }
}
