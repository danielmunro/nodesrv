import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import Check from "../../check/check"
import { MESSAGE_FAIL_ALREADY_AWAKE, MESSAGE_FAIL_DEAD } from "./constants"

export default function(request: Request): Promise<Check> {
  if (request.mob.disposition === Disposition.Standing) {
    return Check.fail(MESSAGE_FAIL_ALREADY_AWAKE)
  }

  if (request.mob.disposition === Disposition.Dead) {
    return Check.fail(MESSAGE_FAIL_DEAD)
  }

  return Check.ok()
}
