import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Disposition } from "../../mob/disposition"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_CANNOT_TRAIN } from "../actions/constants"
import { trainMap } from "../actions/train"
import { MESSAGE_FAIL_NEED_TRAINS, MESSAGE_FAIL_NO_TRAINER, MESSAGE_FAIL_NOT_STANDING } from "./constants"

export default function(request: Request): Promise<Check> {
  const trainer = request.getRoom().mobs.find((mob) => mob.role === Role.Trainer)
  const subject = request.subject

  return new CheckBuilder()
    .require(!subject || trainMap.find(t => t.train === subject), MESSAGE_FAIL_CANNOT_TRAIN, CheckType.ValidSubject)
    .require(request.mob.disposition === Disposition.Standing, MESSAGE_FAIL_NOT_STANDING)
    .requireMob(trainer, MESSAGE_FAIL_NO_TRAINER)
    .addCost(new Cost(CostType.Train, 1, MESSAGE_FAIL_NEED_TRAINS))
    .forPlayer(request.player)
    .create()
}
