import Check from "../../../check/check"
import CheckBuilder from "../../../check/checkBuilder"
import Maybe from "../../../functional/maybe"
import { isBanned } from "../../../mob/standing"
import { Request } from "../../../request/request"
import Service from "../../../service/service"
import {
  MESSAGE_FAIL_ALREADY_BANNED,
  MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NO_TARGET,
} from "./constants"

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find(m => m.name === request.getContextAsInput().subject)

  return new CheckBuilder()
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
