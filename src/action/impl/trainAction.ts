import {allStats} from "../../attributes/constants"
import {Stat} from "../../attributes/stat"
import {Vital} from "../../attributes/vital"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import LocationService from "../../mob/locationService"
import {Mob} from "../../mob/model/mob"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import {format} from "../../support/string"
import Action from "../action"
import {
  ConditionMessages,
  MESSAGE_SUCCESS_STR,
} from "../constants"
import {ConditionMessages as PreconditionMessages} from "../constants"
import {
  MAX_TRAINABLE_STATS, MESSAGE_SUCCESS_CON, MESSAGE_SUCCESS_DEX,
  MESSAGE_SUCCESS_HP, MESSAGE_SUCCESS_INT,
  MESSAGE_SUCCESS_MANA,
  MESSAGE_SUCCESS_MV,
  MESSAGE_SUCCESS_STA, MESSAGE_SUCCESS_WIS,
  Messages,
} from "../constants"

export const VITAL_INCREMENT = 10

function canTrain(stat: number): boolean {
  return stat < MAX_TRAINABLE_STATS
}

function trainStat(mob: Mob, responseBuilder: ResponseBuilder, message: string, stat: Stat): Promise<Response> {
  const stats = mob.playerMob.trainedAttributes.stats
  if (!canTrain(stats[stat])) {
    return responseBuilder.fail(PreconditionMessages.Train.CannotTrainMore)
  }
  stats[stat] += 1
  return responseBuilder.success(message)
}

function trainVital(mob: Mob, responseBuilder: ResponseBuilder, message: string, vital: Vital): Promise<Response> {
  const vitals = mob.playerMob.trainedAttributes.vitals
  vitals[vital] += VITAL_INCREMENT
  mob.playerMob.trains--
  return responseBuilder.success(message)
}

function newTrainMapEntry(method, train: Stat | Vital, message: string) {
  return { method, train, message }
}

const trainMap = [
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

export default class TrainAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly locationService: LocationService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        !subject || trainMap.find(t => t.train === subject),
        ConditionMessages.Train.CannotTrainMore,
        CheckType.ValidSubject)
      .require(
        this.locationService.getMobsInRoomWithMob(request.mob).find(m => m.isTrainer()),
        ConditionMessages.Train.NoTrainer,
        CheckType.HasTarget)
      .capture()
      .addCost(new Cost(CostType.Train, 1, ConditionMessages.Train.LackingTrains))
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const responseBuilder = checkedRequest.respondWith()
    const subject = checkedRequest.getCheckTypeResult(CheckType.ValidSubject)

    if (subject === true) {
      const stats = mob.playerMob.trainedAttributes.stats
      return responseBuilder.info(
        format(Messages.Train.Info, allStats.reduce((previous: string, current: Stat) =>
          previous + (canTrain(stats[current]) ? `${current} ` : ""), "")))
    }

    return subject.method(mob, responseBuilder, subject.message, subject.train)
  }

  protected getRequestType(): RequestType {
    return RequestType.Train
  }
}
