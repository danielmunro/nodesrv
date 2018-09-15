import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"

const MESSAGE_FAIL_NO_MANA = "You lack the mana"
const MANA_COST = 100

export default function(attempt: Attempt): Promise<Check> {
  return attempt.mob.vitals.mana >= MANA_COST ?
    successCheck(attempt, () => attempt.mob.vitals.mana -= MANA_COST) :
    failCheck(attempt, MESSAGE_FAIL_NO_MANA)
}
