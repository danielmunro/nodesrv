import Check from "../../check/check"
import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ALREADY_AWAKE } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.check()
    .not().requireDisposition(Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
    .create()
}
