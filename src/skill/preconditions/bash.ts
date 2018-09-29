import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Costs } from "../constants"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const target = attempt.getSubjectAsMob()
  if (!target || mob === target) {
    return failCheck(Messages.All.NoTarget)
  }
  if (mob.vitals.mv > Costs.Bash.Mv) {
    return successCheck((player: Player) => {
      mob.vitals.mv -= Costs.Bash.Mv
      player.delay += Costs.Bash.Delay
    })
  }
  return failCheck(Messages.All.NotEnoughMv)
}
