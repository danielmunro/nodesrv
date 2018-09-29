import CheckedRequest from "../../check/checkedRequest"
import { addFight, Fight } from "../../mob/fight/fight"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { ATTACK_MOB } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  addFight(new Fight(request.mob, request.getTarget(), request.getRoom()))

  return request.respondWith().success(ATTACK_MOB)
}
