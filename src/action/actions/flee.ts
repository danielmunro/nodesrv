import { Fight } from "../../mob/fight/fight"
import { pickOne } from "../../random/helpers"
import Response from "../../request/response"
import { ResponseStatus } from "../../request/responseStatus"
import Service from "../../room/service"
import CheckedRequest from "../checkedRequest"
import { FLEE_MOVEMENT_COST_MULTIPLIER } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: Service): Promise<Response> {
  const mob = checkedRequest.request.mob
  const room = checkedRequest.request.getRoom()
  const exit = pickOne(room.exits)
  const fight = checkedRequest.check.result as Fight
  fight.participantFled(mob)
  mob.vitals.mv -= room.getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER
  await service.moveMob(mob, exit.direction)

  return new Response(
    checkedRequest.request,
    ResponseStatus.Success,
    `You flee to the ${exit.direction}!`,
  )
}
