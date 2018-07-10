import { Stat } from "../../attributes/stat"
import { Vital } from "../../attributes/vital"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export const MESSAGE_FAIL_UNKNOWN = "You can't train that."
export const MESSAGE_FAIL_CANNOT_TRAIN = "You can't train that anymore."
export const MESSAGE_SUCCESS_STR = "You become stronger!"
export const MESSAGE_SUCCESS_INT = "You gain in intelligence!"
export const MESSAGE_SUCCESS_WIS = "Your wisdom increases!"
export const MESSAGE_SUCCESS_DEX = "Your dexterity increases!"
export const MESSAGE_SUCCESS_CON = "Your constitution grows!"
export const MESSAGE_SUCCESS_STA = "Your stamina increases!"
export const MESSAGE_SUCCESS_HP = "Your hp increases!"
export const MESSAGE_SUCCESS_MANA = "Your mana increases!"
export const MESSAGE_SUCCESS_MV = "Your movement increases!"

export const MAX_TRAINABLE_STATS = 4

function canTrain(stat: number): boolean {
  return stat < MAX_TRAINABLE_STATS
}

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const stats = request.mob.trainedAttributes.stats
  const vitals = request.mob.trainedAttributes.vitals
  const responseBuilder = new ResponseBuilder(request)

  if (!request.subject) {
    return new ResponseBuilder(request).info(
      "You can train: " +
      (canTrain(stats.str) ? `${Stat.Str} ` : "") +
      (canTrain(stats.int) ? `${Stat.Int} ` : "") +
      (canTrain(stats.wis) ? `${Stat.Wis} ` : "") +
      (canTrain(stats.dex) ? `${Stat.Dex} ` : "") +
      (canTrain(stats.con) ? `${Stat.Con} ` : "") +
      (canTrain(stats.sta) ? `${Stat.Sta} ` : "") +
      "hp mana mv")
  }

  switch (request.subject) {
    case Stat.Str:
      if (!canTrain(stats.str)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.str += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_STR)
    case Stat.Int:
      if (!canTrain(stats.int)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.int += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_INT)
    case Stat.Wis:
      if (!canTrain(stats.wis)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.wis += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_WIS)
    case Stat.Dex:
      if (!canTrain(stats.dex)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.dex += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_DEX)
    case Stat.Con:
      if (!canTrain(stats.con)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.con += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_CON)
    case Stat.Sta:
      if (!canTrain(stats.sta)) {
        return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
      }
      stats.sta += 1
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_STA)
    case Vital.Hp:
      vitals.hp += 10
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_HP)
    case Vital.Mana:
      vitals.mana += 10
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_MANA)
    case Vital.Mv:
      vitals.mv += 10
      request.mob.trains--
      return responseBuilder.success(MESSAGE_SUCCESS_MV)
    default:
      return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
  }
}
