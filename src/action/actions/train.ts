import { allStats } from "../../attributes/constants"
import { Stat } from "../../attributes/stat"
import { Vital } from "../../attributes/vital"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Maybe from "../../functional/maybe"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import {
  MAX_TRAINABLE_STATS,
  MESSAGE_FAIL_CANNOT_TRAIN,
  MESSAGE_SUCCESS_CON,
  MESSAGE_SUCCESS_DEX,
  MESSAGE_SUCCESS_HP,
  MESSAGE_SUCCESS_INT,
  MESSAGE_SUCCESS_MANA,
  MESSAGE_SUCCESS_MV,
  MESSAGE_SUCCESS_STA,
  MESSAGE_SUCCESS_STR,
  MESSAGE_SUCCESS_WIS,
} from "./constants"

function canTrain(stat: number): boolean {
  return stat < MAX_TRAINABLE_STATS
}

function trainStat(mob: Mob, responseBuilder: ResponseBuilder, message: string, stat: Stat): Promise<Response> {
  const stats = mob.playerMob.trainedAttributes.stats
  if (!canTrain(stats[stat])) {
    return responseBuilder.fail(MESSAGE_FAIL_CANNOT_TRAIN)
  }
  stats[stat] += 1
  return responseBuilder.success(message)
}

function trainVital(mob: Mob, responseBuilder: ResponseBuilder, message: string, vital: Vital): Promise<Response> {
  const vitals = mob.playerMob.trainedAttributes.vitals
  vitals[vital] += 10
  mob.playerMob.trains--
  return responseBuilder.success(message)
}

function newTrainMapEntry(method, train: Stat | Vital, message: string) {
  return { method, train, message }
}

export const trainMap = [
  newTrainMapEntry(trainStat, Stat.Str, MESSAGE_SUCCESS_STR),
  newTrainMapEntry(trainStat, Stat.Int, MESSAGE_SUCCESS_INT),
  newTrainMapEntry(trainStat, Stat.Wis, MESSAGE_SUCCESS_WIS),
  newTrainMapEntry(trainStat, Stat.Dex, MESSAGE_SUCCESS_DEX),
  newTrainMapEntry(trainStat, Stat.Con, MESSAGE_SUCCESS_CON),
  newTrainMapEntry(trainStat, Stat.Sta, MESSAGE_SUCCESS_STA),
  newTrainMapEntry(trainVital, Vital.Hp, MESSAGE_SUCCESS_HP),
  newTrainMapEntry(trainVital, Vital.Mana, MESSAGE_SUCCESS_MANA),
  newTrainMapEntry(trainVital, Vital.Mv, MESSAGE_SUCCESS_MV),
]

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const stats = request.mob.playerMob.trainedAttributes.stats
  const responseBuilder = checkedRequest.respondWith()
  const subject = checkedRequest.getCheckTypeResult(CheckType.ValidSubject)

  if (!subject) {
    return responseBuilder.info(
      "You can train: " +
      allStats.reduce((previous: string, current: Stat) =>
        previous + (canTrain(stats[current]) ? `${current} ` : ""), "") +
      "hp mana mv")
  }

  return subject.method(request.mob, responseBuilder, subject.message, subject.train)
}
