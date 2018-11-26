import Check from "../../../check/check"
import CheckBuilder from "../../../check/checkBuilder"
import GameService from "../../../gameService/gameService"
import { isBanned } from "../../../mob/enum/standing"
import { Request } from "../../../request/request"
import Maybe from "../../../support/functional/maybe"
import {
  MESSAGE_FAIL_BANNED,
  MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS, MESSAGE_FAIL_NO_TARGET,
} from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  const mob = service.mobService.mobTable.find((m) => m.name === request.getContextAsInput().subject)
  return new CheckBuilder()
    .requireMob(mob, MESSAGE_FAIL_NO_TARGET)
    .capture()
    .requirePlayer(mob)
    .requireImmortal(request.getAuthorizationLevel())
    .require(m => !isBanned(m.getStanding()), MESSAGE_FAIL_BANNED)
    .not().requireImmortal(
      Maybe.if(mob, () => mob.getAuthorizationLevel()),
      MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS)
    .create()
}
