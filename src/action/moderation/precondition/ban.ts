import Check from "../../../check/check"
import CheckBuilder from "../../../check/checkBuilder"
import Maybe from "../../../support/functional/maybe"
import GameService from "../../../gameService/gameService"
import { isBanned } from "../../../mob/enum/standing"
import { Request } from "../../../request/request"
import {
  MESSAGE_FAIL_ALREADY_BANNED,
  MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NO_TARGET,
} from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  const mob = service.mobService.mobTable.find(m => m.name === request.getContextAsInput().subject)

  return new CheckBuilder(service.mobService)
    .requireMob(mob, MESSAGE_FAIL_NO_TARGET)
    .capture()
    .requirePlayer(mob)
    .requireSpecialAuthorization(request.getAuthorizationLevel())
    .require(m => !isBanned(m.getStanding()), MESSAGE_FAIL_ALREADY_BANNED)
    .not().requireSpecialAuthorization(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
    .create()
}
