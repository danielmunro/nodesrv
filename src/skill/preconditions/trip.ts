import { Player } from "../../player/model/player"
import { Costs } from "../actions/constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { MESSAGE_FAIL_TOO_TIRED } from "./constants"

export const COST_DELAY = 1
export const COST_MV = 5

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.vitals.mv > Costs.Trip.Mv) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= Costs.Trip.Mv
      player.delay += Costs.Trip.Delay
    })
  }
  return failCheck(attempt, MESSAGE_FAIL_TOO_TIRED)
}
