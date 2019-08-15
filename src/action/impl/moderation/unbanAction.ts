import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {isBanned, Standing} from "../../../mob/enum/standing"
import MobService from "../../../mob/service/mobService"
import Maybe from "../../../support/functional/maybe/maybe"
import {Types} from "../../../support/types"
import {
  MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS,
  MESSAGE_FAIL_NOT_BANNED, Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class UnbanAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: MobEntity) => m.name === request.getSubject()) as MobEntity
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .requireSpecialAuthorization(request.getAuthorizationLevel())
      .require((m: MobEntity) => isBanned(m.getStanding()), MESSAGE_FAIL_NOT_BANNED)
      .not().requireSpecialAuthorization(
        Maybe.if(mob, () => mob.getAuthorizationLevel()).get(),
        MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult<MobEntity>()
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
