import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck } from "../checkFactory"
import { CheckResult } from "../checkResult"

export const COST_DELAY = 2
export const COST_MV = 5

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const target = attempt.target
  if (!target || mob === target) {
    return failCheck(attempt)
  }
  if (mob.vitals.mv > COST_MV) {
    return new Promise((resolve) => resolve(new Check(attempt, CheckResult.Able, (player: Player) => {
      mob.vitals.mv -= COST_MV
      player.delay += COST_DELAY
    })))
  }
  return failCheck(attempt)
}
