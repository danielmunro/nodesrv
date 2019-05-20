import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {isBanned, Standing} from "../../../mob/enum/standing"
import {Mob} from "../../../mob/model/mob"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {
  MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NOT_BANNED, Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class UnbanAction extends Action {
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
      .requireSpecialAuthorization(request.getAuthorizationLevel())
      .require((m: Mob) => isBanned(m.getStanding()), MESSAGE_FAIL_NOT_BANNED)
      .not().requireSpecialAuthorization(
        Maybe.if(mob, () => mob.getAuthorizationLevel()).get(),
        MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult()
    target.playerMob.standing = Standing.Good
    return requestService.respondWith()
      .success(`You have lifted the ban on ${target.name}.`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Unban
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
