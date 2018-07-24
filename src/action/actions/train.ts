import { allStats, Stat } from "../../attributes/stat"
import { Vital } from "../../attributes/vital"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

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

function trainStat(mob: Mob, responseBuilder: ResponseBuilder, message: string, stat: Stat): Promise<Response> {
  const stats = mob.playerMob.trainedAttributes.stats
  if (!canTrain(stats[stat])) {
    return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
  }
  stats[stat] += 1
  mob.playerMob.trains--
  return responseBuilder.success(message)
}

function trainVital(mob: Mob, responseBuilder: ResponseBuilder, message: string, vital: Vital): Promise<Response> {
  const vitals = mob.playerMob.trainedAttributes.vitals
  vitals[vital] += 10
  mob.playerMob.trains--
  return responseBuilder.success(message)
}

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const stats = request.mob.playerMob.trainedAttributes.stats
  const responseBuilder = new ResponseBuilder(request)

  if (!request.subject) {
    return new ResponseBuilder(request).info(
      "You can train: " +
      allStats.reduce((previous: string, current: Stat) =>
        previous + (canTrain(stats[current]) ? `${current} ` : ""), "") +
      "hp mana mv")
  }

  if (request.subject === Stat.Str) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_STR, Stat.Str)
  } else if (request.subject === Stat.Int) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_INT, Stat.Int)
  } else if (request.subject === Stat.Wis) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_WIS, Stat.Wis)
  } else if (request.subject === Stat.Dex) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_DEX, Stat.Dex)
  } else if (request.subject === Stat.Con) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_CON, Stat.Con)
  } else if (request.subject === Stat.Sta) {
    return trainStat(request.mob, responseBuilder, MESSAGE_SUCCESS_STA, Stat.Sta)
  } else if (request.subject === Vital.Hp) {
    return trainVital(request.mob, responseBuilder, MESSAGE_SUCCESS_HP, Vital.Hp)
  } else if (request.subject === Vital.Mana) {
    return trainVital(request.mob, responseBuilder, MESSAGE_SUCCESS_MANA, Vital.Mana)
  } else if (request.subject === Vital.Mv) {
    return trainVital(request.mob, responseBuilder, MESSAGE_SUCCESS_MV, Vital.Mv)
  }

  return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
}
