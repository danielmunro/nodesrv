import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {isBanned, Standing} from "../../../mob/enum/standing"
import MobService from "../../../mob/mobService"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import Action from "../../action"
import {
  MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NOT_BANNED,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class UnbanAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find(m => m.name === request.getContextAsInput().subject)
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .requireSpecialAuthorization(request.getAuthorizationLevel())
      .require(m => isBanned(m.getStanding()), MESSAGE_FAIL_NOT_BANNED)
      .not().requireSpecialAuthorization(
        Maybe.if(mob, () => mob.getAuthorizationLevel()),
        MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const target = checkedRequest.check.result
    target.playerMob.standing = Standing.Good
    return request.respondWith().success(`You have lifted the ban on ${target.name}.`)
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Target ]
  }

  protected getRequestType(): RequestType {
    return RequestType.Unban
  }
}
