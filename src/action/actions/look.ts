import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export const NOT_FOUND = "You don't see that anywhere."

export default function(request: Request): Promise<Response> {
  const builder = new ResponseBuilder(request)
  if (request.subject) {
    const mob = request.findMobInRoom()
    if (mob) {
      return builder.info(mob.description)
    }

    let item = request.findItemInRoomInventory()
    if (item) {
      return builder.info(item.description)
    }

    item = request.findItemInSessionMobInventory()
    if (item) {
      return builder.info(item.description)
    }

    return builder.error(NOT_FOUND)
  }

  return builder.info(request.getRoom().toString())
}
