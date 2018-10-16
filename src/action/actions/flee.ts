import CheckedRequest from "../../check/checkedRequest"
import { Fight } from "../../mob/fight/fight"
import { pickOne } from "../../random/helpers"
import Response from "../../request/response"
import Service from "../../service/service"
import { FLEE_MOVEMENT_COST_MULTIPLIER, Messages } from "./constants"

export default async function(checkedRequest: CheckedRequest, service: Service): Promise<Response> {
  const request = checkedRequest.request
  const mob = request.mob
  const room = request.getRoom()
  const exit = pickOne(room.exits)
  const fight = checkedRequest.check.result as Fight
  fight.participantFled(mob)
  mob.vitals.mv -= room.getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER
  await service.moveMob(mob, exit.direction)

  return checkedRequest.respondWith().success(
    Messages.Flee.Success,
    { direction: exit.direction })
}
