import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/checkType"
import {ItemType} from "../../../item/enum/itemType"
import {Item} from "../../../item/model/item"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class OpenItemAction extends Action {
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
        () => request.mob.inventory.findItemByName(request.getSubject()),
        ConditionMessages.Open.Fail.NotFound,
        CheckType.HasTarget)
      .capture()
      .require(
        (item: Item) => item.itemType === ItemType.Container,
        ConditionMessages.Open.Fail.NotAContainer)
      .require(
        (item: Item) => item.container.isClosed,
        ConditionMessages.Open.Fail.AlreadyOpen)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult(CheckType.HasTarget)
    item.container.isClosed = false

    return requestService.respondWith().success(
      Messages.OpenContainer.Success, {
        item: item.name,
        openVerb: "open",
      }, {
        item: item.name,
        openVerb: "opens",
      })
  }

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
