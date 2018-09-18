import { Player } from "../../player/model/player"
import { Costs } from "../constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const target = attempt.getSubjectAsMob()
  if (!target || mob === target) {
    return failCheck(attempt, Messages.All.NoTarget)
  }
  if (mob.vitals.mv > Costs.Bash.Mv) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= Costs.Bash.Mv
      player.delay += Costs.Bash.Delay
    })
  }
  return failCheck(attempt, Messages.All.NotEnoughMv)
}
