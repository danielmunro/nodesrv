import { addFight, Fight } from "../../mob/fight/fight"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export const ATTACK_MOB = "You scream and attacks!"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const fight = new Fight(checkedRequest.request.mob, checkedRequest.request.getTarget())
  addFight(fight)

  return new ResponseBuilder(checkedRequest.request).success(ATTACK_MOB)
}
