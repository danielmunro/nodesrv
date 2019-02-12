import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {isBanned} from "../../../mob/enum/standing"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {AuthorizationLevel, getAuthorizationLevelName} from "../../../player/authorizationLevel"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {MESSAGE_FAIL_NO_MORE_PROMOTIONS, Messages} from "../../constants"
import {MESSAGE_FAIL_BANNED, MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class PromoteAction extends Action {
  public static getNextPromotion(mob: Mob) {
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
      .require(m => !isBanned(m.getStanding()), MESSAGE_FAIL_BANNED)
      .not().requireImmortal(
        Maybe.if(mob, () => mob.getAuthorizationLevel()),
        MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.check.result
    const newAuthorizationLevel = PromoteAction.getNextPromotion(target)
    const responseBuilder = checkedRequest.request.respondWith()

    return new Maybe(newAuthorizationLevel)
      .do(() => {
        target.playerMob.authorizationLevel = newAuthorizationLevel
        return responseBuilder.success(
            `You promoted ${target.name} to ${getAuthorizationLevelName(newAuthorizationLevel)}.`)
      })
      .or(() => responseBuilder.error(MESSAGE_FAIL_NO_MORE_PROMOTIONS))
      .get()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Promote
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
