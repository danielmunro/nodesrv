import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import {isBanned} from "../../mob/enum/standing"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .require(!isBanned(request.mob.getStanding()), Messages.Social.LackingStanding)
    .requireMob()
    .create()
}
