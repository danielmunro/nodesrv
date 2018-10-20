import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { getFights } from "../../mob/fight/fight"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import {
  MESSAGE_FAIL_CANNOT_ATTACK_SELF,
  MESSAGE_FAIL_KILL_ALREADY_FIGHTING,
  MESSAGE_FAIL_KILL_NO_TARGET,
} from "./constants"

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget() as Mob
  const mob = request.mob
  return new CheckBuilder()
    .requireMob(target, MESSAGE_FAIL_KILL_NO_TARGET)
    .capture()
    .require(mob !== target, MESSAGE_FAIL_CANNOT_ATTACK_SELF)
    .require(!getFights().find(f => f.isParticipant(mob)), MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
    .create()
}
