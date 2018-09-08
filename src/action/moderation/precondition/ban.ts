import Maybe from "../../../functional/maybe"
import { isBanned } from "../../../mob/standing"
import { Request } from "../../../request/request"
import Service from "../../../room/service"
import Check from "../../check"
import CheckBuilder from "../../checkBuilder"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_NOT_PLAYER = "They are not a player."
export const MESSAGE_FAIL_ALREADY_BANNED = "They are already banned."
export const MESSAGE_FAIL_CANNOT_BAN_SELF = "You cannot ban yourself."
export const MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS = "You cannot ban admin accounts."
export const MESSAGE_FAIL_NOT_AUTHORIZED = "You cannot do that."

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)
  return new CheckBuilder().requireTarget(mob, MESSAGE_FAIL_NO_TARGET)
    .requirePlayer(mob)
    .requireSpecialAuthorization(request.getAuthorizationLevel())
    .require(Maybe.if(mob, () =>
      !request.player.ownsMob(mob)), MESSAGE_FAIL_CANNOT_BAN_SELF)
    .require(Maybe.if(mob, () =>
      !isBanned(mob.getStanding())), MESSAGE_FAIL_ALREADY_BANNED)
    .not().requireSpecialAuthorization(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
    .create(mob)
}
