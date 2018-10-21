import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import { getFights } from "../../mob/fight/fight"
import { Request } from "../../request/request"
import { FLEE_MOVEMENT_COST_MULTIPLIER } from "../action/constants"
import { MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE, MESSAGE_FAIL_NOT_FIGHTING, MESSAGE_FAIL_TOO_TIRED } from "./constants"

export default function(request: Request): Promise<Check> {
  const fight = getFights().find((f) => f.isParticipant(request.mob))

  if (!fight) {
    return Check.fail(MESSAGE_FAIL_NOT_FIGHTING)
  }

  if (request.getRoom().exits.length === 0) {
    return Check.fail(MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE)
  }

  if (request.mob.vitals.mv < request.getRoom().getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER) {
    return Check.fail(MESSAGE_FAIL_TOO_TIRED)
  }

  return Check.ok(fight, [], [new Cost(CostType.Delay, 1)])
}
