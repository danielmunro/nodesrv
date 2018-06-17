import Attempt from "../attempt"
import Check from "../check"
import { CheckResult } from "../checkResult"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  if (mob.vitals.mv > cost) {
    mob.vitals.mv -= cost
    return new Promise(() => new Check(attempt, CheckResult.Able, 2))
  }

  return new Promise(() => new Check(attempt, CheckResult.Unable))
}
