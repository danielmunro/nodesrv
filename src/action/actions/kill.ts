import CheckedRequest from "../../check/checkedRequest"
import { addFight, Fight } from "../../mob/fight/fight"
import Response from "../../request/response"
import { Messages } from "./constants"
import { Mob } from "../../mob/model/mob"
import { Room } from "../../room/model/room"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  fight(request.mob, request.getTarget(), request.getRoom())

  return checkedRequest.respondWith().success(Messages.Kill.Success)
}

function fight(attacker: Mob, defender: Mob, room: Room) {
  addFight(new Fight(attacker, defender, room))
}
