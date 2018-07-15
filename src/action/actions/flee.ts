import { Fight } from "../../mob/fight/fight"
import { pickOne } from "../../random/helpers"
import Response from "../../request/response"
import { ResponseStatus } from "../../request/responseStatus"
import { moveMob } from "../../room/service"
import CheckedRequest from "../checkedRequest"

export const FLEE_MOVEMENT_COST_MULTIPLIER = 3

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.request.mob
  const room = checkedRequest.request.getRoom()
  const exit = pickOne(room.exits)
  const fight = checkedRequest.check.result as Fight
  fight.participantFled(mob)
  mob.vitals.mv -= room.getMovementCost() * FLEE_MOVEMENT_COST_MULTIPLIER
  await moveMob(mob, exit.direction)

  return new Response(
    checkedRequest.request,
    ResponseStatus.Success,
    `You flee to the ${exit.direction}!`,
  )
}
