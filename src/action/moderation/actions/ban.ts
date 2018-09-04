import { Request } from "../../../request/request"
import Response from "../../../request/response"
import { Standing } from "../../../mob/standing"
import ResponseBuilder from "../../../request/responseBuilder"

export default function(request: Request): Promise<Response> {
  const target = request.getTarget()
  const newStanding = request.object as Standing
  target.playerMob.standing = newStanding
  return new ResponseBuilder(request).success(`You have set ${target.name} to a standing of ${newStanding}.`)
}
