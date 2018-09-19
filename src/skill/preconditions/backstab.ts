import Attempt from "../attempt"
import Check from "../check"
import { Costs } from "../constants"
import { Messages } from "./constants"
import { failCheck, successCheck } from "../checkFactory"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob

  if (mob.vitals.mv < Costs.Backstab.Mv) {
    return failCheck(attempt, Messages.All.NotEnoughMv)
  }

  return successCheck(attempt, () => mob.vitals.mv -= Costs.Backstab.Mv)
}
