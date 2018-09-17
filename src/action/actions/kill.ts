import { addFight, Fight } from "../../mob/fight/fight"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"
import { ATTACK_MOB } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const fight = new Fight(checkedRequest.request.mob, checkedRequest.request.getTarget())
  addFight(fight)

  return new ResponseBuilder(checkedRequest.request).success(ATTACK_MOB)
}
