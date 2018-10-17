import CheckedRequest from "../../check/checkedRequest"
import { addFight, Fight } from "../../mob/fight/fight"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"
import { Room } from "../../room/model/room"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  fight(request.mob, request.getTarget() as Mob, request.getRoom())

  return checkedRequest.respondWith().success(
    Messages.Kill.Success,
    { screamVerb: "scream", attackVerb: "attack", target: request.getTarget() },
    { screamVerb: "screams", attackVerb: "attacks", target: "you" },
  { screamVerb: "screams", attackVerb: "attacks", target: request.getTarget() })
}

function fight(attacker: Mob, defender: Mob, room: Room) {
  addFight(new Fight(attacker, defender, room))
}
