import { getFights } from "../../mob/fight/fight"
import { findOneMob } from "../../mob/repository/mob"
import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_KILL_NO_TARGET = "Who would you like to kill?"
export const MESSAGE_FAIL_KILL_ALREADY_FIGHTING = "No way! You are already fighting."
export const MESSAGE_FAIL_CANNOT_ATTACK_SELF = "No way! You can't attack yourself."

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget()

  if (!target) {
    return Check.fail(MESSAGE_FAIL_KILL_NO_TARGET)
  }

  const mob = request.player.sessionMob

  if (mob === target) {
    return Check.fail(MESSAGE_FAIL_CANNOT_ATTACK_SELF)
  }

  const fight = getFights().find((f) => f.isParticipant(mob))

  if (fight) {
    return Check.fail(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  }

  return Check.ok(target)
}
