import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { Direction } from "../../room/constants"
import Service from "../../room/service"
import CheckedRequest from "../checkedRequest"
import look from "./look"

export default async function(checkedRequest: CheckedRequest, direction: Direction, service: Service): Promise<Response> {
  const request = checkedRequest.request
  const builder = new ResponseBuilder(request)
  request.player.sessionMob.vitals.mv -= request.getRoom().getMovementCost()
  await service.moveMob(request.player.sessionMob, direction)
  const lookAtRoom = await look(request)

  return builder.info(lookAtRoom.message)
}
