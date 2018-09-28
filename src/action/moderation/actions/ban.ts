import { Standing } from "../../../mob/standing"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import CheckedRequest from "../../../check/checkedRequest"

export enum Ban {
  Lift = "lift",
  Cooloff = "cooloff",
  Indefinite = "indefinite",
  Perma = "perma",
}

function getNewStanding(arg): Standing {
  switch (arg) {
    case Ban.Lift:
      return Standing.Good
    case Ban.Indefinite:
      return Standing.IndefiniteBan
    case Ban.Perma:
      return Standing.PermaBan
    case Ban.Cooloff:
      return Standing.Cooloff
    default:
      return null
  }
}

export function getBanCommand(subject) {
  return subject ? subject : Ban.Cooloff
}

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const target = checkedRequest.check.result
  const command = getBanCommand(request.component)
  const newStanding = getNewStanding(command)
  target.playerMob.standing = newStanding

  return request.respondWith().success(`You have banned ${target.name} with a ban level: ${newStanding}.`)
}
