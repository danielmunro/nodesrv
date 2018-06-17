import Attempt from "./attempt"
import Check from "./check"
import { CheckResult } from "./checkResult"

export function failCheck(attempt: Attempt) {
  return new Check(attempt, CheckResult.Unable)
}
