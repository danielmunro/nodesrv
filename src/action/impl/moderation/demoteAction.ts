import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {AuthorizationLevel, getAuthorizationLevelName} from "../../../player/authorizationLevel"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {MESSAGE_FAIL_NO_MORE_DEMOTIONS} from "../../constants"
import {MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

function getNextDemotion(mob: Mob) {
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

export default class DemoteAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find(m => m.name === request.getSubject())
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .requireImmortal(request.getAuthorizationLevel())
      .not().requireImmortal(
        Maybe.if(mob, () => mob.getAuthorizationLevel()),
        MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.check.result
    const responseBuilder = checkedRequest.request.respondWith()

    return new Maybe(getNextDemotion(target))
      .do((newAuthorizationLevel) => {
        target.playerMob.authorizationLevel = newAuthorizationLevel
        return responseBuilder.success(
          `You demoted ${target.name} to ${getAuthorizationLevelName(newAuthorizationLevel)}.`)
      })
      .or(() => responseBuilder.error(MESSAGE_FAIL_NO_MORE_DEMOTIONS))
      .get()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Demote
  }
}
