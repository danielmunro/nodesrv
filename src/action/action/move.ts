import CheckedRequest from "../../check/checkedRequest"
import GameService from "../../gameService/gameService"
import Response from "../../request/response"
import { Direction } from "../../room/constants"
import look from "./look"

export default async function(checkedRequest: CheckedRequest,
                              direction: Direction,
                              service: GameService): Promise<Response> {
  const request = checkedRequest.request

  request.mob.vitals.mv -= request.getRoom().getMovementCost()
  await service.moveMob(request.mob, direction)
  const lookAtRoom = await look(checkedRequest, service)

  return checkedRequest.respondWith().info(lookAtRoom.message.getMessageToRequestCreator())
}
