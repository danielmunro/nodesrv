import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import { trainMap } from "../actions/train"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const subject = request.getContextAsInput().subject

  return request.checkWithStandingDisposition()
    .require(
      !subject || trainMap.find(t => t.train === subject),
      Messages.Train.CannotTrainMore,
      CheckType.ValidSubject)
    .requireMob(
      request.getRoom().mobs.find(mob => mob.role === Role.Trainer),
      Messages.Train.NoTrainer)
    .addCost(new Cost(CostType.Train, 1, Messages.Train.LackingTrains))
    .create()
}
