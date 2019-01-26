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
import {ConditionMessages as PreconditionMessages} from "../constants"
import {
  ConditionMessages,
  MAX_TRAINABLE_STATS,
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
  newTrainMapEntry(trainStat, Stat.Str, Messages.Train.Str),
  newTrainMapEntry(trainStat, Stat.Int, Messages.Train.Int),
  newTrainMapEntry(trainStat, Stat.Wis, Messages.Train.Wis),
  newTrainMapEntry(trainStat, Stat.Dex, Messages.Train.Dex),
  newTrainMapEntry(trainStat, Stat.Con, Messages.Train.Con),
  newTrainMapEntry(trainStat, Stat.Sta, Messages.Train.Sta),
  newTrainMapEntry(trainVital, Vital.Hp, Messages.Train.Hp),
  newTrainMapEntry(trainVital, Vital.Mana, Messages.Train.Mana),
  newTrainMapEntry(trainVital, Vital.Mv, Messages.Train.Mv),
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
