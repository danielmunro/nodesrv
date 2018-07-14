import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Direction } from "../../room/constants"
import { moveMob } from "../../room/service"
import CheckedRequest from "../checkedRequest"
import look from "./look"

export default async function(checkedRequest: CheckedRequest, direction: Direction): Promise<Response> {
  const request = checkedRequest.request
  const builder = new ResponseBuilder(request)
  request.player.sessionMob.vitals.mv -= request.getRoom().getMovementCost()
  await moveMob(request.player.sessionMob, direction)
  const lookAtRoom = await look(request)

  return builder.info(lookAtRoom.message)
}
