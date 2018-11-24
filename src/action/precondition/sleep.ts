import Check from "../../check/check"
import { Disposition } from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return request.check(service.mobService)
    .not().requireDisposition(Disposition.Sleeping, Messages.Sleep.AlreadySleeping)
    .create()
}
