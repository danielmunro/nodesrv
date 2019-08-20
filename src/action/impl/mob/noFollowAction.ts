import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import MobService from "../../../mob/service/mobService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class NoFollowAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action]
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.NoFollow
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const allowingFollow = requestService.setAllowFollow()
    const verb = allowingFollow ? "are" : "are no longer"
    this.mobService.removeFollowers(requestService.getMob())
    return requestService.respondWith().success(
      Messages.NoFollow.Success,
      { verb },
      { verb },
      { verb })
  }
}
