import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"

export const COST_DELAY = 1
export const COST_MV = 5
export const MESSAGE_FAIL_TOO_TIRED = "You are too tired."

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.vitals.mv > COST_MV) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= COST_MV
      player.delay += COST_DELAY
    })
  }
  return failCheck(attempt, MESSAGE_FAIL_TOO_TIRED)
}
