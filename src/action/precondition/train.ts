import { Disposition } from "../../mob/disposition"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import Check from "../check/check"
import { MESSAGE_FAIL_NEED_TRAINS, MESSAGE_FAIL_NO_TRAINER, MESSAGE_FAIL_NOT_STANDING } from "./constants"

export default function(request: Request): Promise<Check> {
  if (request.mob.disposition !== Disposition.Standing) {
    return Check.fail(MESSAGE_FAIL_NOT_STANDING)
  }

  const trainer = request.getRoom().mobs.find((mob) => mob.role === Role.Trainer)

  if (!trainer) {
    return Check.fail(MESSAGE_FAIL_NO_TRAINER)
  }

  if (request.mob.playerMob.trains === 0) {
    return Check.fail(MESSAGE_FAIL_NEED_TRAINS)
  }

  return Check.ok(trainer)
}
