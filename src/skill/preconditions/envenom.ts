import { Costs } from "../constants"
import Attempt from "../attempt"
import Check from "../check"
import { failCheck, successCheck } from "../checkFactory"
import { Messages } from "./constants"

export default function(attempt: Attempt): Promise<Check> {
  return attempt.mob.vitals.mana >= Costs.Envenom.Mana ?
    successCheck(attempt, () => attempt.mob.vitals.mana -= Costs.Envenom.Mana) :
    failCheck(attempt, Messages.All.NotEnoughMana)
}
