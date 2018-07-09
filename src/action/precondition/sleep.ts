import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_ALREADY_ASLEEP = "You are already asleep."
export const MESSAGE_FAIL_DEAD = "You are dead."

export default function(request: Request): Promise<Check> {
  if (request.mob.disposition === Disposition.Sleeping) {
    return Check.fail(MESSAGE_FAIL_ALREADY_ASLEEP)
  }

  if (request.mob.disposition === Disposition.Dead) {
    return Check.fail(MESSAGE_FAIL_DEAD)
  }

  return Check.ok()
}
