import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class OpenDoorAction extends Action {
  private static getDoor(request: Request) {
    return request.room.exits.find(exit =>
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

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const exit = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    exit.door.isClosed = false

    return checkedRequest.respondWith().success(
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
