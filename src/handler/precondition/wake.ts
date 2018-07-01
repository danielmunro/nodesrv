import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_ALREADY_AWAKE = "You're already awake."
export const MESSAGE_FAIL_DEAD = "You're dead."

export default function(request: Request): Promise<Check> {
  if (request.mob.disposition === Disposition.Standing) {
    return Check.fail(MESSAGE_FAIL_ALREADY_AWAKE)
  }

  if (request.mob.disposition === Disposition.Dead) {
    return Check.fail(MESSAGE_FAIL_DEAD)
  }

  return Check.ok()
}
