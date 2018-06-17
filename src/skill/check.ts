import Attempt from "./attempt"
import { CheckResult } from "./checkResult"

export default class Check {
  public readonly attempt: Attempt
  public readonly checkResult: CheckResult
  public readonly delayIncurred: number

  constructor(attempt: Attempt, checkResult: CheckResult, delayIncurred: number = 0) {
    this.attempt = attempt
    this.checkResult = checkResult
    this.delayIncurred = delayIncurred
  }
}
