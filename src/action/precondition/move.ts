import { applyAffectModifier } from "../../affect/applyAffect"
import Check from "../../check/check"
import { Trigger } from "../../mob/trigger"
import { Request } from "../../request/request"
import { Direction } from "../../room/constants"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST, MESSAGE_OUT_OF_MOVEMENT } from "./constants"

export default function(request: Request, direction: Direction): Promise<Check> {
  const movementCost = applyAffectModifier(
    request.mob.affects.map(a => a.affectType),
    Trigger.MovementCost,
    request.getRoom().getMovementCost())

  if (request.mob.vitals.mv < movementCost) {
    return Check.fail(MESSAGE_OUT_OF_MOVEMENT)
  }

  const exit = request.player.getExit(direction)

  if (!exit) {
    return Check.fail(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  }

  return Check.ok()
}
