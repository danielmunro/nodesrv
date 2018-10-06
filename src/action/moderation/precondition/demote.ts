import Check from "../../../check/check"
import CheckBuilder from "../../../check/checkBuilder"
import Maybe from "../../../functional/maybe"
import { Request } from "../../../request/request"
import Service from "../../../service/service"
import {
  MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS,
  MESSAGE_FAIL_CANNOT_DEMOTE_SELF,
  MESSAGE_FAIL_NO_TARGET,
} from "./constants"

export default async function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.getContextAsInput().subject)
  return new CheckBuilder().requireMob(mob, MESSAGE_FAIL_NO_TARGET)
    .requirePlayer(mob)
    .requireImmortal(request.getAuthorizationLevel())
    .not().requireImmortal(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS)
    .create(mob)
}
