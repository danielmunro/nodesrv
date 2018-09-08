import Maybe from "../../../functional/maybe"
import { Request } from "../../../request/request"
import Service from "../../../room/service"
import Check from "../../check"
import CheckBuilder from "../../checkBuilder"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_CANNOT_DEMOTE_SELF = "You cannot demote yourself."
export const MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS = "Immortals cannot be demoted."

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)
  return new CheckBuilder().requireTarget(mob, MESSAGE_FAIL_NO_TARGET)
    .requirePlayer(mob)
    .requireImmortal(request.getAuthorizationLevel())
    .require(Maybe.if(mob, () =>
      !request.player.ownsMob(mob)), MESSAGE_FAIL_CANNOT_DEMOTE_SELF)
    .not().requireImmortal(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS)
    .create(mob)
}
