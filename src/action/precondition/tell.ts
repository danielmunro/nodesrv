import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import {isBanned} from "../../mob/enum/standing"
import { Request } from "../../request/request"
import match from "../../support/matcher/match"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getSubject()
  return request.check(service.mobService)
    .require(!isBanned(request.mob.getStanding()), Messages.Social.LackingStanding)
    .requireMob(service.mobService.mobTable.find(mob => match(mob.name, subject)))
    .create()
}
