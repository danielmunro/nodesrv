import Check from "../../check/check"
import { Disposition } from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.check()
    .not().requireDisposition(Disposition.Sleeping, Messages.Sleep.AlreadySleeping)
    .create()
}
