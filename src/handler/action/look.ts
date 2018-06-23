import { Request } from "../../request/request"
import Response from "../../request/response"

export const NOT_FOUND = "You don't see that anywhere."

export default function(request: Request): Promise<Response> {
  if (request.subject) {
    const mob = request.findMobInRoom()
    if (mob) {
      return request.ok(mob.description)
    }

    let item = request.findItemInRoomInventory()
    if (item) {
      return request.ok(item.description)
    }

    item = request.findItemInSessionMobInventory()
    if (item) {
      return request.ok(item.description)
    }

    return request.error(NOT_FOUND)
  }

  return request.ok(request.getRoom().toString())
}
