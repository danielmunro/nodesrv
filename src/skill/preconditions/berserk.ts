import { AffectType } from "../../affect/affectType"
import { Player } from "../../player/model/player"
import { Costs } from "../actions/constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { MESSAGE_FAIL_ALREADY_BERSERKED, MESSAGE_FAIL_TOO_TIRED } from "./constants"

export const COST_DELAY = 2

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.getAffect(AffectType.Berserk)) {
    return failCheck(attempt, MESSAGE_FAIL_ALREADY_BERSERKED)
  }
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  if (mob.vitals.mv > cost) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= cost
      player.delay += Costs.Berserk.Delay
    })
  }
  return failCheck(attempt, MESSAGE_FAIL_TOO_TIRED)
}
