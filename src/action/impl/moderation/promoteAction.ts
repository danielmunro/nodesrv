import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {isBanned} from "../../../mob/enum/standing"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {getAuthorizationLevelName} from "../../../player/authorizationLevel"
import {getNextPromotion} from "../../../player/authorizationLevels"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import {format} from "../../../support/string"
import Action from "../../action"
import {
  MESSAGE_FAIL_BANNED,
  MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS,
  Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class PromoteAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: Mob) => m.name === request.getSubject())
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .require(
        () => getNextPromotion(mob),
        format(Messages.Promote.Fail.NoMorePromotions, mob.name),
        CheckType.AuthorizationLevel)
      .requireImmortal(request.getAuthorizationLevel())
      .require((m: Mob) => !isBanned(m.getStanding()), MESSAGE_FAIL_BANNED)
      .not().requireImmortal(
        Maybe.if(mob, () => mob.getAuthorizationLevel()),
        MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.check.result
    const authorizationLevel = checkedRequest.getCheckTypeResult(CheckType.AuthorizationLevel)
    const responseBuilder = checkedRequest.request.respondWith()

    target.playerMob.authorizationLevel = authorizationLevel
    return responseBuilder.success(
        `You promoted ${target.name} to ${getAuthorizationLevelName(authorizationLevel)}.`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Promote
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
