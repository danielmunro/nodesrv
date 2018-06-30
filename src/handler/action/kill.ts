import { addFight, Fight } from "../../mob/fight/fight"
import CheckedRequest from "../checkedRequest"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

export const ATTACK_MOB = "You scream and attack!"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const fight = new Fight(checkedRequest.request.player.sessionMob, checkedRequest.check.result)
  addFight(fight)

  return new ResponseBuilder(checkedRequest.request).success(ATTACK_MOB)
}
