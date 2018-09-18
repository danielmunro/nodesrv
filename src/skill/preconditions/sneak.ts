import { Player } from "../../player/model/player"
import { Costs } from "../constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.vitals.mv > Costs.Sneak.Delay) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= Costs.Sneak.Delay
      player.delay += Costs.Sneak.Delay
    })
  }
  return failCheck(attempt, Messages.All.NotEnoughMv)
}
