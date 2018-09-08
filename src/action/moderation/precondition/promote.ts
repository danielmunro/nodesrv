import Maybe from "../../../functional/maybe"
import { isBanned } from "../../../mob/standing"
import { Request } from "../../../request/request"
import Service from "../../../room/service"
import Check from "../../check"
import CheckBuilder from "../../checkBuilder"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_BANNED = "They are banned and cannot be promoted."
export const MESSAGE_FAIL_CANNOT_PROMOTE_SELF = "You cannot promote yourself."
export const MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS = "There is nothing beyond immortals."

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)
  return new CheckBuilder().requireTarget(mob, MESSAGE_FAIL_NO_TARGET)
    .requirePlayer(mob)
    .requireImmortal(request.getAuthorizationLevel())
    .require(Maybe.if(mob, () =>
      !request.player.ownsMob(mob)), MESSAGE_FAIL_CANNOT_PROMOTE_SELF)
    .require(Maybe.if(mob, () =>
      !isBanned(mob.getStanding())), MESSAGE_FAIL_BANNED)
    .not().requireImmortal(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS)
    .create(mob)
}
