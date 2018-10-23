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

function checkImprove(response: Response, checkType: CheckType, baseImproveChance: number = BASE_IMPROVE_CHANCE) {
  let it = initialImproveRoll()
  if (response.isSuccessful()) {
    it += successModifierRoll()
  }
  if (it <= baseImproveChance) {
    response
      .getCheckedRequest()
      .getCheckTypeResult(checkType).level++
  }
  return response
}

function improve(method, check, improveChance) {
  return async request => checkImprove(await method(request), check, improveChance)
}

export function improveSkill(method, improveChance = BASE_IMPROVE_CHANCE) {
  return improve(method, CheckType.HasSkill, improveChance)
}

export function improveSpell(method, improveChance = BASE_IMPROVE_CHANCE) {
  return improve(method, CheckType.HasSpell, improveChance)
}
