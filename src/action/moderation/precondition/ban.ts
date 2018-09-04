import { Request } from "../../../request/request"
import Check from "../../check"
import Service from "../../../room/service"

export const MESSAGE_FAIL_NO_TARGET = "They don't exist."
export const MESSAGE_FAIL_NOT_PLAYER = "They are not a player."

export default function(request: Request, service: Service): Promise<Check> {
  const mob = service.mobTable.find((m) => m.name === request.subject)

  if (!mob) {
    return Check.fail(MESSAGE_FAIL_NO_TARGET)
  }

  if (!mob.isPlayer) {
    return Check.fail(MESSAGE_FAIL_NOT_PLAYER)
  }

  return Check.ok(mob)
}
