import Attempt from "../attempt"

export default function(attempt: Attempt): boolean {
  const mob = attempt.mob
  attempt.delay += 2
  if (mob.vitals.mv > 5) {
    mob.vitals.mv -= 5
    return true
  }

  return false
}
