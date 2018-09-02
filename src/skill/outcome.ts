import Attempt from "./attempt"
import { OutcomeType } from "./outcomeType"

export default class Outcome {
  private improvement: boolean

  constructor(
    public readonly attempt: Attempt,
    public readonly outcomeType: OutcomeType,
    private readonly message: string = "",
    public readonly delayIncurred: number = 0) {}

  public getMessage(): string {
    return this.message + (this.improvement ? `\nYour ${this.attempt.skill.skillType} improves!` : "")
  }

  public setImprovement(improvement: boolean) {
    if (this.improvement !== undefined) {
      throw new Error("improvement is immutable")
    }

    this.improvement = improvement
  }

  public wasSuccessful(): boolean {
    return this.outcomeType === OutcomeType.Success
  }
}
