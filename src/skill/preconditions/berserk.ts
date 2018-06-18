import { AffectType } from "../../affect/affectType"
import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"

export const COST_DELAY = 2
export const MESSAGE_FAIL_ALREADY_BERSERKED = "You are already at an elevated level of battle readiness."
export const MESSAGE_FAIL_TOO_TIRED = "You are too tired."

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.getAffect(AffectType.Berserk)) {
    return failCheck(attempt, MESSAGE_FAIL_ALREADY_BERSERKED)
  }
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  if (mob.vitals.mv > cost) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= cost
      player.delay += COST_DELAY
    })
  }
  return failCheck(attempt, MESSAGE_FAIL_TOO_TIRED)
}
