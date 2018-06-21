import { Request } from "../../request/request"
import Response from "../../request/response"
import { Direction } from "../../room/constants"
import { moveMob } from "../../room/service"

export const MESSAGE_DIRECTION_DOES_NOT_EXIST = "Alas, that direction does not exist."

export default async function(request: Request, direction: Direction): Promise<Response> {
  const exit = request.player.getExit(direction)

  if (!exit) {
    return request.fail(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  }

  await moveMob(request.player.sessionMob, direction)

  return request.ok(request.player.sessionMob.room.toString())
}
