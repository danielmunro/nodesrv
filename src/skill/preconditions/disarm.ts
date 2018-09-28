import { MESSAGE_FAIL_TOO_TIRED } from "../../action/precondition/constants"
import { Equipment } from "../../item/equipment"
import { getFights } from "../../mob/fight/fight"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { format } from "../../support/string"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Costs } from "../constants"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob
  const fight = getFights().find(f => f.isParticipant(mob))
  if (!fight) {
    return failCheck(attempt, Messages.All.NoTarget)
  }

  const target = attempt.attemptContext.subject as Mob
  const weapon = target.equipped.inventory.find(i => i.equipment === Equipment.Weapon)
  if (!weapon) {
    return failCheck(attempt, format(Messages.Disarm.FailNothingToDisarm, target.name))
  }

  if (mob.vitals.mv < Costs.Disarm.Mv) {
    return failCheck(attempt, Messages.All.NotEnoughMv)
  }

  return successCheck(attempt, (player: Player) => {
    mob.vitals.mv -= Costs.Disarm.Mv
    player.delay += Costs.Disarm.Delay
  })
}
