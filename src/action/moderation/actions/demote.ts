import Maybe from "../../../functional/maybe"
import { Mob } from "../../../mob/model/mob"
import { AuthorizationLevel, getAuthorizationLevelName } from "../../../player/authorizationLevel"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import CheckedRequest from "../../checkedRequest"
import { MESSAGE_FAIL_NO_MORE_DEMOTIONS } from "./constants"

export function getNextDemotion(mob: Mob) {
  switch (mob.getAuthorizationLevel()) {
    case AuthorizationLevel.Judge:
      return AuthorizationLevel.Admin
    case AuthorizationLevel.Admin:
      return AuthorizationLevel.Mortal
    case AuthorizationLevel.Mortal:
      return AuthorizationLevel.None
    default:
      return undefined
  }
}

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.check.result
  const responseBuilder = new ResponseBuilder(checkedRequest.request)

  return new Maybe(getNextDemotion(target))
    .do((newAuthorizationLevel) => {
      target.playerMob.authorizationLevel = newAuthorizationLevel
      return responseBuilder.success(
        `You demoted ${target.name} to ${getAuthorizationLevelName(newAuthorizationLevel)}.`)
    })
    .or(() => responseBuilder.fail(MESSAGE_FAIL_NO_MORE_DEMOTIONS))
    .get()
}
