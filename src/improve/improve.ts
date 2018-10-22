import { CheckType } from "../check/checkType"
import roll from "../random/dice"
import Response from "../request/response"
import { BASE_IMPROVE_CHANCE } from "../skill/constants"

function initialImproveRoll(): number {
  return roll(1, 1000)
}

function successModifierRoll(): number {
  return roll(5, 10)
}

function checkImprove(response: Response, baseImproveChance: number = BASE_IMPROVE_CHANCE) {
  let it = initialImproveRoll()
  if (response.isSuccessful()) {
    it += successModifierRoll()
  }
  if (it <= baseImproveChance) {
    response.getCheckedRequest().getCheckTypeResult(CheckType.HasSkill).level++
  }
  return response
}

export default function improve(method, improveChance = BASE_IMPROVE_CHANCE) {
  return async request => checkImprove(await method(request), improveChance)
}
