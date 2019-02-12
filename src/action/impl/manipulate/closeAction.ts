import Check from "../../../check/check"
import CheckBuilder from "../../../check/checkBuilder"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {ItemType} from "../../../item/itemType"
import {Item} from "../../../item/model/item"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages } from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class CloseAction extends Action {
  private static getItem(request: Request) {
    return request.mob.inventory.findItemByName(request.getSubject())
  }

  private static requireItemPreconditions(checkBuilder: CheckBuilder, item) {
    return checkBuilder.require(
      item,
      ConditionMessages.Close.Fail.NotFound,
      CheckType.HasTarget)
      .capture()
      .require(
        item.itemType === ItemType.Container,
        ConditionMessages.Close.Fail.ItemIsNotAContainer)
      .require(
        !item.container.isClosed,
        ConditionMessages.Close.Fail.AlreadyClosed)
      .require(
        item.container.isCloseable,
        ConditionMessages.Close.Fail.CannotClose)
  }

  private static closeContainer(checkedRequest, item) {
    item.container.isClosed = true

    return checkedRequest.respondWith().success(
      Messages.CloseContainer.Success, {
        closeVerb: "close",
        item: item.name,
      }, {
        closeVerb: "closes",
        item: item.name,
      })
  }

  private static closeDoor(checkedRequest, exit) {
    exit.door.isClosed = true

    return checkedRequest.respondWith().success(
      Messages.CloseDoor.Success, {
        closeVerb: "close",
        direction: exit.direction,
        door: exit.door.name,
      }, {
        closeVerb: "closes",
        direction: exit.direction,
        door: exit.door.name,
      })
  }

  private static getDoor(request) {
    return request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject()))
  }

  private static requireDoorPreconditions(checkBuilder: CheckBuilder, request: Request) {
    return checkBuilder.require(
      request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject())),
      ConditionMessages.Close.Fail.NotFound,
      CheckType.HasTarget)
      .capture()
      .require(
        exit => !exit.door.isClosed,
        ConditionMessages.Close.Fail.AlreadyClosed)
      .require(
        exit => !exit.door.noClose,
        ConditionMessages.Close.Fail.CannotClose)
  }

  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const checkBuilder = this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Close,
        CheckType.HasArguments)

    if (!request.getSubject()) {
      return checkBuilder.create()
    }

    const door = CloseAction.getDoor(request)
    if (door) {
      return CloseAction.requireDoorPreconditions(checkBuilder, request).create()
    }

    const item = CloseAction.getItem(request)
    if (item) {
      return CloseAction.requireItemPreconditions(checkBuilder, item).create()
    }

    return checkBuilder.create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

    if (target instanceof Exit) {
      return CloseAction.closeDoor(checkedRequest, target)
    } else if (target instanceof Item) {
      return CloseAction.closeContainer(checkedRequest, target)
    }

    return checkedRequest.respondWith().error("Unknown problem")
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  protected getRequestType(): RequestType {
    return RequestType.Close
  }
}
