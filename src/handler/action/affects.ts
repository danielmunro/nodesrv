import { Affect } from "../../affect/model/affect"
import { Request } from "../../request/request"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"

function reduceAffects(affects) {
  return affects.reduce(
    (previous, current: Affect) =>
      previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"),
    "")
}

export default function(request: Request): Promise<Response> {
  return new ResponseBuilder(request).info("Your affects:\n" + reduceAffects(request.player.sessionMob.affects))
}
