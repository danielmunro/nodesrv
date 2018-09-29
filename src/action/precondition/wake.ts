import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ALREADY_AWAKE, MESSAGE_FAIL_DEAD } from "./constants"

export default function(request: Request): Promise<Check> {
  const disposition = request.mob.disposition

  return new CheckBuilder()
    .require(disposition !== Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
    .require(disposition !== Disposition.Dead, MESSAGE_FAIL_DEAD)
    .create()
}
