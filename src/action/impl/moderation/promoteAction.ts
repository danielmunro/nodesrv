import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {isBanned} from "../../../mob/enum/standing"
import {Mob} from "../../../mob/model/mob"
import MobService from "../../../mob/service/mobService"
import {getAuthorizationLevelName, getNextPromotion} from "../../../player/authorizationLevels"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import {format} from "../../../support/string"
import {
  MESSAGE_FAIL_BANNED,
  MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS,
  Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class PromoteAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: Mob) => m.name === request.getSubject()) as Mob
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
        Maybe.if(mob, () => mob.getAuthorizationLevel()).get(),
        MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const [ target, authorizationLevel ] = requestService.getResults(
      CheckType.HasTarget, CheckType.AuthorizationLevel)
    target.playerMob.authorizationLevel = authorizationLevel
    return requestService.respondWith().success(
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
