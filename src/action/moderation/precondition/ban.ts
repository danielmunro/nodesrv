import Check from "../../../check/check"
import GameService from "../../../gameService/gameService"
import { isBanned } from "../../../mob/enum/standing"
import { Request } from "../../../request/request"
import Maybe from "../../../support/functional/maybe"
import {
  MESSAGE_FAIL_ALREADY_BANNED,
  MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS,
} from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  const mob = service.mobService.mobTable.find(m => m.name === request.getContextAsInput().subject)

  return service.createDefaultCheckFor(request)
    .requireMob()
    .capture()
    .requirePlayer(mob)
    .requireSpecialAuthorization(request.getAuthorizationLevel())
    .require(m => !isBanned(m.getStanding()), MESSAGE_FAIL_ALREADY_BANNED)
    .not().requireSpecialAuthorization(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
    .create()
}
