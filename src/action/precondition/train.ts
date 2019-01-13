import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import {trainMap} from "../action/train"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getSubject()
  return service.createDefaultCheckFor(request)
    .require(
      !subject || trainMap.find(t => t.train === subject),
      Messages.Train.CannotTrainMore,
      CheckType.ValidSubject)
    .require(
      service.mobService.findMobInRoomWithMob(request.mob, m => m.isTrainer()),
      Messages.Train.NoTrainer,
      CheckType.HasTarget)
    .capture()
    .addCost(new Cost(CostType.Train, 1, Messages.Train.LackingTrains))
    .create()
}
