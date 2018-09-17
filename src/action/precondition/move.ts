import { Request } from "../../request/request"
import { Direction } from "../../room/constants"
import Check from "../check"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST, MESSAGE_OUT_OF_MOVEMENT } from "./constants"

export default function(request: Request, direction: Direction): Promise<Check> {
  if (request.player.sessionMob.vitals.mv < request.getRoom().getMovementCost()) {
    return Check.fail(MESSAGE_OUT_OF_MOVEMENT)
  }

  const exit = request.player.getExit(direction)

  if (!exit) {
    return Check.fail(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  }

  return Check.ok()
}
