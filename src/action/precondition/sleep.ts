import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Disposition } from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.check(service.mobService)
    .not().requireDisposition(Disposition.Sleeping, Messages.Sleep.AlreadySleeping)
    .create()
}
