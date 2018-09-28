import Response from "../../request/response"
import { Direction } from "../../room/constants"
import Service from "../../service/service"
import CheckedRequest from "../../check/checkedRequest"
import look from "./look"

export default async function(checkedRequest: CheckedRequest,
                              direction: Direction,
                              service: Service): Promise<Response> {
  const request = checkedRequest.request
  request.player.sessionMob.vitals.mv -= request.getRoom().getMovementCost()
  await service.moveMob(request.player.sessionMob, direction)
  const lookAtRoom = await look(request, service)

  return request.respondWith().info(lookAtRoom.message)
}
