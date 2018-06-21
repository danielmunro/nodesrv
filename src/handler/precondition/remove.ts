import { Request } from "../../request/request"
import Check, { CheckStatus } from "../check"

export const MESSAGE_REMOVE_FAIL = "You aren't wearing that."

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.equipped.inventory.findItemByName(request.subject)

  if (!item) {
    return new Promise((resolve) => resolve(new Check(CheckStatus.Failed, MESSAGE_REMOVE_FAIL)))
  }

  return new Promise((resolve) =>
    resolve(new Check(CheckStatus.Ok, `You remove ${item.name} and put it in your inventory.`)))
}
