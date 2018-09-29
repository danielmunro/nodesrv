import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Costs } from "../constants"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  const mob = attempt.mob

  if (mob.vitals.mv < Costs.Backstab.Mv) {
    return failCheck(Messages.All.NotEnoughMv)
  }

  return successCheck(() => mob.vitals.mv -= Costs.Backstab.Mv)
}
