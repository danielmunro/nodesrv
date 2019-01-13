import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import {
  MESSAGE_FAIL_CANNOT_ATTACK_SELF,
  MESSAGE_FAIL_KILL_ALREADY_FIGHTING,
  MESSAGE_FAIL_KILL_NO_TARGET,
} from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  const target = request.getTarget() as Mob
  const mob = request.mob
  return service.createDefaultCheckFor(request)
    .requireMob(MESSAGE_FAIL_KILL_NO_TARGET)
    .capture()
    .require(mob !== target, MESSAGE_FAIL_CANNOT_ATTACK_SELF)
    .require(!service.mobService.findFight(f => f.isParticipant(mob)), MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
    .create()
}
