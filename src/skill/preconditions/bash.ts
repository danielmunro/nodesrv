import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_TOO_TIRED } from "./constants"

export const COST_DELAY = 2
export const COST_MV = 5

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const target = attempt.getSubjectAsMob()
  if (!target || mob === target) {
    return failCheck(attempt, MESSAGE_FAIL_NO_TARGET)
  }
  if (mob.vitals.mv > COST_MV) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= COST_MV
      player.delay += COST_DELAY
    })
  }
  return failCheck(attempt, MESSAGE_FAIL_TOO_TIRED)
}
