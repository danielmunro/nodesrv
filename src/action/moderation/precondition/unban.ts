import Maybe from "../../../functional/maybe"
import { isBanned } from "../../../mob/standing"
import { Request } from "../../../request/request"
import Service from "../../../room/service"
import Check from "../../check"
import CheckBuilder from "../../checkBuilder"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_NOT_BANNED = "They are not banned."
export const MESSAGE_FAIL_CANNOT_UNBAN_SELF = "You cannot un-ban yourself."
export const MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS = "You cannot un-ban admin accounts."

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)
  return new CheckBuilder().requireTarget(mob, MESSAGE_FAIL_NO_TARGET)
    .requirePlayer(mob)
    .requireAdmin(request.getAuthorizationLevel())
    .require(Maybe.if(mob, () =>
      !request.player.ownsMob(mob)), MESSAGE_FAIL_CANNOT_UNBAN_SELF)
    .require(Maybe.if(mob, () =>
      isBanned(mob.getStanding())), MESSAGE_FAIL_NOT_BANNED)
    .not().requireAdmin(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS)
    .create(mob)
}
