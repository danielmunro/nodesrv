import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Costs } from "../constants"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob

  if (mob.vitals.mv < Costs.Backstab.Mv) {
    return failCheck(attempt, Messages.All.NotEnoughMv)
  }

  return successCheck(attempt, () => mob.vitals.mv -= Costs.Backstab.Mv)
}
