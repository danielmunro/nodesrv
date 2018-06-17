import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck } from "../checkFactory"
import { CheckResult } from "../checkResult"

export const COST_DELAY = 2

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  if (mob.vitals.mv > cost) {
    return new Promise((resolve) => resolve(new Check(attempt, CheckResult.Able, (player: Player) => {
      mob.vitals.mv -= cost
      player.delay += COST_DELAY
    })))
  }

  return new Promise((resolve) => resolve(failCheck(attempt)))
}
