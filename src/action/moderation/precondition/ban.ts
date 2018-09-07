import { isBanned } from "../../../mob/standing"
import { isSpecialAuthorizationLevel } from "../../../player/authorizationLevel"
import { Request } from "../../../request/request"
import Service from "../../../room/service"
import Check from "../../check"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_NOT_PLAYER = "They are not a player."
export const MESSAGE_FAIL_ALREADY_BANNED = "They are already banned."
export const MESSAGE_FAIL_CANNOT_BAN_SELF = "You cannot ban yourself."
export const MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS = "You cannot ban admin accounts."
export const MESSAGE_FAIL_NOT_AUTHORIZED = "You cannot do that."

export default function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)

  if (!mob) {
    return Check.fail(MESSAGE_FAIL_NO_TARGET)
  }

  if (!mob.isPlayer) {
    return Check.fail(MESSAGE_FAIL_NOT_PLAYER)
  }

  if (isBanned(mob.playerMob.standing)) {
    return Check.fail(MESSAGE_FAIL_ALREADY_BANNED)
  }

  if (request.player.ownsMob(mob)) {
    return Check.fail(MESSAGE_FAIL_CANNOT_BAN_SELF)
  }

  if (isSpecialAuthorizationLevel(mob.playerMob.authorizationLevel)) {
    return Check.fail(MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS)
  }

  if (!isSpecialAuthorizationLevel(request.mob.playerMob.authorizationLevel)) {
    return Check.fail(MESSAGE_FAIL_NOT_AUTHORIZED)
  }

  return Check.ok(mob)
}
