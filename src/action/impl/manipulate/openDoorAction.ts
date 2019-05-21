import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class OpenDoorAction extends Action {
  private static getDoor(request: Request) {
    return request.getRoomExits().find(exit =>
      exit.door && match(exit.door.name, request.getSubject()))
  }

  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Open,
        CheckType.HasArguments)
      .require(
        () => OpenDoorAction.getDoor(request),
        ConditionMessages.Open.Fail.NotFound,
        CheckType.HasTarget)
      .capture()
      .require(
        (exit: Exit) => !exit.door.isLocked,
        ConditionMessages.Open.Fail.Locked)
      .require(
        (exit: Exit) => exit.door.isClosed,
        ConditionMessages.Open.Fail.AlreadyOpen)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult()
    exit.door.isClosed = false

    return requestService.respondWith().success(
      Messages.OpenDoor.Success, {
        direction: exit.direction,
        door: exit.door.name,
        openVerb: "open",
      }, {
        direction: exit.direction,
        door: exit.door.name,
        openVerb: "opens",
      })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Open
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
