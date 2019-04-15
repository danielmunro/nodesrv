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
import {ConditionMessages } from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class CloseDoorAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Close,
        CheckType.HasArguments)
      .requireTarget(
        request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject())),
        ConditionMessages.Close.Fail.NotFound)
      .capture()
      .require(
        (exit: Exit) => !exit.door.isClosed,
        ConditionMessages.Close.Fail.AlreadyClosed)
      .require(
        (exit: Exit) => !exit.door.noClose,
        ConditionMessages.Close.Fail.CannotClose)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const exit = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    exit.door.isClosed = true

    return checkedRequest.respondWith().success(
      Messages.CloseDoor.Success,
      {
        closeVerb: "close",
        direction: exit.direction,
        door: exit.door.name,
      },
    {
        closeVerb: "closes",
        direction: exit.direction,
        door: exit.door.name,
      })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Close
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
