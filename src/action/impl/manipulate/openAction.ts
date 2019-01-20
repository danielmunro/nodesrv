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
import {ConditionMessages} from "../../constants"

export default class OpenAction extends Action {
  private static getItem(request: Request) {
    return request.mob.inventory.findItemByName(request.getSubject())
  }

  private static requireItemPreconditions(checkBuilder: CheckBuilder, item) {
    return checkBuilder.require(
      item,
      ConditionMessages.Open.Fail.NotFound,
      CheckType.HasTarget)
      .capture()
      .require(
        item.itemType === ItemType.Container,
        ConditionMessages.Open.Fail.NotAContainer)
      .require(
        item.container.isClosed,
        ConditionMessages.Open.Fail.AlreadyOpen)
  }

  private static requireDoorPreconditions(checkBuilder: CheckBuilder, door) {
    return checkBuilder.require(
      door,
      ConditionMessages.Open.Fail.NotFound,
      CheckType.HasTarget)
      .capture()
      .require(
        exit => !exit.door.isLocked,
        ConditionMessages.Open.Fail.Locked)
      .require(
        exit => exit.door.isClosed,
        ConditionMessages.Open.Fail.AlreadyOpen)
  }

  private static getDoor(request) {
    return request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject()))
  }

  private static openContainer(checkedRequest, item) {
    item.container.isClosed = false

    return checkedRequest.respondWith().success(
      Messages.OpenContainer.Success, {
        item: item.name,
        openVerb: "open",
      }, {
        item: item.name,
        openVerb: "opens",
      })
  }

  private static openDoor(checkedRequest, exit: Exit) {
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

  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const checkBuilder = this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Open,
        CheckType.HasArguments)

    if (!request.getSubject()) {
      return checkBuilder.create()
    }

    const door = OpenAction.getDoor(request)
    if (door) {
      return OpenAction.requireDoorPreconditions(checkBuilder, door).create()
    }

    const item = OpenAction.getItem(request)
    if (item) {
      return OpenAction.requireItemPreconditions(checkBuilder, item).create()
    }

    return checkBuilder.create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

    if (target instanceof Exit) {
      return OpenAction.openDoor(checkedRequest, target)
    } else if (target instanceof Item) {
      return OpenAction.openContainer(checkedRequest, target)
    }

    return checkedRequest.respondWith().error("Unknown problem")
  }

  protected getRequestType(): RequestType {
    return RequestType.Open
  }
}
