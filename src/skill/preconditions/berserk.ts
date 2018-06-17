import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { CheckResult } from "../checkResult"
import { failCheck } from "../checkFactory"

export const COST_DELAY = 2

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, 40)
  if (mob.vitals.mv > cost) {
    return new Promise(() => new Check(attempt, CheckResult.Able, (player: Player) => {
      mob.vitals.mv -= cost
      player.delay += COST_DELAY
    }))
  }

  return new Promise(() => failCheck(attempt))
}
