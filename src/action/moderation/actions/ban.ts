import CheckedRequest from "../../../check/checkedRequest"
import { Standing } from "../../../mob/enum/standing"
import Response from "../../../request/response"
import ResponseMessage from "../../../request/responseMessage"

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
  const command = getBanCommand(request.getContextAsInput().component)
  const newStanding = getNewStanding(command)
  target.playerMob.standing = newStanding

  return request.respondWith().success(
    new ResponseMessage(`You have banned ${target.name} with a ban level: ${newStanding}.`))
}
