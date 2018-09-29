import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Disposition } from "../../mob/disposition"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import { trainMap } from "../actions/train"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const trainer = request.getRoom().mobs.find((mob) => mob.role === Role.Trainer)
  const subject = request.subject

  return new CheckBuilder()
    .require(
      !subject || trainMap.find(t => t.train === subject),
      Messages.Train.CannotTrainMore,
      CheckType.ValidSubject)
    .require(request.mob.disposition === Disposition.Standing, Messages.Train.NotStanding)
    .requireMob(trainer, Messages.Train.NoTrainer)
    .addCost(new Cost(CostType.Train, 1, Messages.Train.LackingTrains))
    .forPlayer(request.player)
    .create()
}
