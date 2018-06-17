import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck } from "../checkFactory"
import { CheckResult } from "../checkResult"

export const COST_DELAY = 1
export const COST_MV = 5

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.vitals.mv > COST_MV) {
    return new Promise(() => new Check(attempt, CheckResult.Able, (player: Player) => {
      mob.vitals.mv -= COST_MV
      player.delay += COST_DELAY
    }))
  }

  return new Promise(() => failCheck(attempt))
}
