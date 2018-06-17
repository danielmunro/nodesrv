import Attempt from "../attempt"

export default function(attempt: Attempt): boolean {
  const mob = attempt.mob
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  attempt.delay += 2
  if (mob.vitals.mv > cost) {
    mob.vitals.mv -= cost
    return true
  }

  return false
}
