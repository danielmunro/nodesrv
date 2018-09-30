import Check from "../../check/check"
import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ALREADY_ASLEEP } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.check()
    .not().requireDisposition(Disposition.Sleeping, MESSAGE_FAIL_ALREADY_ASLEEP)
    .create()
}
