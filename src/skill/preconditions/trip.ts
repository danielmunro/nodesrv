import Attempt from "../attempt"
import Check from "../check"
import { CheckResult } from "../checkResult"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.vitals.mv > 5) {
    mob.vitals.mv -= 5
    return new Promise(() => new Check(attempt, CheckResult.Able, 1))
  }

  return new Promise(() => new Check(attempt, CheckResult.Unable))
}
