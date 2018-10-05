import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { Direction } from "../../room/constants"
import Service from "../../service/service"
import look from "./look"

export default async function(checkedRequest: CheckedRequest,
                              direction: Direction,
                              service: Service): Promise<Response> {
  const request = checkedRequest.request

  request.mob.vitals.mv -= request.getRoom().getMovementCost()
  await service.moveMob(request.mob, direction)
  const lookAtRoom = await look(request, service)

  return checkedRequest.respondWith().info(lookAtRoom.message)
}
