import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Direction } from "../../room/constants"
import { moveMob } from "../../room/service"
import look from "./look"

export const MESSAGE_DIRECTION_DOES_NOT_EXIST = "Alas, that direction does not exist."

export default async function(request: Request, direction: Direction): Promise<Response> {
  const builder = new ResponseBuilder(request)
  const exit = request.player.getExit(direction)

  if (!exit) {
    return builder.error(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  }

  await moveMob(request.player.sessionMob, direction)
  const lookAtRoom = await look(request)

  return builder.info(lookAtRoom.message)
}
