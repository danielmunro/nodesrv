import CheckedRequest from "../../../check/checkedRequest"
import { Mob } from "../../../mob/model/mob"
import { AuthorizationLevel, getAuthorizationLevelName } from "../../../player/authorizationLevel"
import Response from "../../../request/response"
import ResponseMessage from "../../../request/responseMessage"
import Maybe from "../../../support/functional/maybe"
import { MESSAGE_FAIL_NO_MORE_PROMOTIONS } from "./constants"

export function getNextPromotion(mob: Mob) {
  switch (mob.getAuthorizationLevel()) {
    case AuthorizationLevel.None:
      return AuthorizationLevel.Mortal
    case AuthorizationLevel.Mortal:
      return AuthorizationLevel.Admin
    case AuthorizationLevel.Admin:
      return AuthorizationLevel.Judge
    case AuthorizationLevel.Judge:
      return AuthorizationLevel.Immortal
    default:
      return undefined
  }
}

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.check.result
  const newAuthorizationLevel = getNextPromotion(target)
  const responseBuilder = checkedRequest.request.respondWith()

  return new Maybe(newAuthorizationLevel)
    .do(() => {
      target.playerMob.authorizationLevel = newAuthorizationLevel
      return responseBuilder.success(
        new ResponseMessage(
          `You promoted ${target.name} to ${getAuthorizationLevelName(newAuthorizationLevel)}.`))
    })
    .or(() => responseBuilder.error(MESSAGE_FAIL_NO_MORE_PROMOTIONS))
    .get()
}
