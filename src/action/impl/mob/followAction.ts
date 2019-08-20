import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import MobService from "../../../mob/service/mobService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class FollowAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .require((target: MobEntity) => target.allowFollow, Messages.Follow.NotAllowed)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.MobInRoom]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Follow
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult<MobEntity>(CheckType.HasTarget)
    this.mobService.addFollow(requestService.getMob(), target)
    return requestService.respondWith().success(
      Messages.Follow.Success,
      { verb: "begin", target },
      { verb: "begins", target: "you" },
      { verb: "begins", target })
  }
}
