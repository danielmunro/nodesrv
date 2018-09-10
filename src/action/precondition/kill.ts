import { getFights } from "../../mob/fight/fight"
import { Request } from "../../request/request"
import Check from "../check"
import CheckBuilder from "../checkBuilder"

export const MESSAGE_FAIL_KILL_NO_TARGET = "Who would you like to kill?"
export const MESSAGE_FAIL_KILL_ALREADY_FIGHTING = "No way! You are already fighting."
export const MESSAGE_FAIL_CANNOT_ATTACK_SELF = "No way! You can't attacks yourself."

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget()
  const mob = request.mob
  return new CheckBuilder().requireTarget(target, MESSAGE_FAIL_KILL_NO_TARGET)
    .require(mob !== target, MESSAGE_FAIL_CANNOT_ATTACK_SELF)
    .require(!getFights().find((f) => f.isParticipant(mob)), MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
    .create(target)
}
