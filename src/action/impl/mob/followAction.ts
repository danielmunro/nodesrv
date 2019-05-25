import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class FollowAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
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
    const target = requestService.getResult(CheckType.HasTarget)
    requestService.setFollow(target)
    return requestService.respondWith().success(
      Messages.Follow.Success,
      { verb: "begin", target },
      { verb: "begins", target: "you" },
      { verb: "begins", target })
  }
}
