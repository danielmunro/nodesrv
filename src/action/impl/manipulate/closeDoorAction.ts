import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {ExitEntity} from "../../../room/entity/exitEntity"
import match from "../../../support/matcher/match"
import {Messages} from "../../constants"
import {ConditionMessages } from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

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
        request.getRoomExits().find(exit => exit.door && match(exit.door.name, request.getSubject())),
        ConditionMessages.Close.Fail.NotFound)
      .capture()
      .require(
        (exit: ExitEntity) => !exit.door.isClosed,
        ConditionMessages.Close.Fail.AlreadyClosed)
      .require(
        (exit: ExitEntity) => !exit.door.noClose,
        ConditionMessages.Close.Fail.CannotClose)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult<ExitEntity>()
    exit.door.isClosed = true

    return requestService.respondWith().success(
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
