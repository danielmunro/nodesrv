import { Standing } from "../../../mob/standing"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import CheckedRequest from "../../checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const target = request.getTarget()
  const newStanding = Standing.IndefiniteBan
  target.playerMob.standing = newStanding
  return new ResponseBuilder(request).success(`You have set ${target.name} to a standing of ${newStanding}.`)
}
