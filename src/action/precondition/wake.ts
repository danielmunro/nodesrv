import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Disposition } from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ALREADY_AWAKE } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.check(service.mobService)
    .not().requireDisposition(Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
    .create()
}
