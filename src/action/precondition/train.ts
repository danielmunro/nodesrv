import { Disposition } from "../../mob/disposition"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_NOT_STANDING = "You must be standing to train."
export const MESSAGE_FAIL_NO_TRAINER = "No trainer is here."
export const MESSAGE_FAIL_NEED_TRAINS = "You need more training sessions first."

export default function(request: Request): Promise<Check> {
  if (request.mob.disposition !== Disposition.Standing) {
    return Check.fail(MESSAGE_FAIL_NOT_STANDING)
  }

  const trainer = request.getRoom().mobs.find((mob) => mob.role === Role.Trainer)

  if (!trainer) {
    return Check.fail(MESSAGE_FAIL_NO_TRAINER)
  }

  if (request.mob.trains === 0) {
    return Check.fail(MESSAGE_FAIL_NEED_TRAINS)
  }

  return Check.ok(trainer)
}
