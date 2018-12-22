import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { trainMap } from "../action/train"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getContextAsInput().subject

  return request.checkWithStandingDisposition(service.mobService)
    .require(
      !subject || trainMap.find(t => t.train === subject),
      Messages.Train.CannotTrainMore,
      CheckType.ValidSubject)
    .requireMob(
      service.getMobsByRoom(request.room).find(mob => mob.traits.trainer),
      Messages.Train.NoTrainer)
    .capture()
    .addCost(new Cost(CostType.Train, 1, Messages.Train.LackingTrains))
    .create()
}
