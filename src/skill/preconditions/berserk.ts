import { AffectType } from "../../affect/affectType"
import { Player } from "../../player/model/player"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Costs } from "../constants"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  if (mob.getAffect(AffectType.Berserk)) {
    return failCheck(attempt, Messages.Berserk.FailAlreadyInvoked)
  }
  const cost = Math.max(mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv)
  if (mob.vitals.mv > cost) {
    return successCheck(attempt, (player: Player) => {
      mob.vitals.mv -= cost
      player.delay += Costs.Berserk.Delay
    })
  }
  return failCheck(attempt, Messages.All.NotEnoughMv)
}
