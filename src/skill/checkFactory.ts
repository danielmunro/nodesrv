import Attempt from "./attempt"
import Check from "./check"
import { CheckResult } from "./checkResult"

export function failCheck(attempt: Attempt): Promise<Check> {
  return new Promise((resolve) => resolve(new Check(attempt, CheckResult.Unable)))
}
