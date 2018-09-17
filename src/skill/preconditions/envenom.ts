import { Costs } from "../actions/constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { MESSAGE_FAIL_NO_MANA } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  return attempt.mob.vitals.mana >= Costs.Envenom.Mana ?
    successCheck(attempt, () => attempt.mob.vitals.mana -= Costs.Envenom.Mana) :
    failCheck(attempt, MESSAGE_FAIL_NO_MANA)
}
