import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {ItemType} from "../../../item/enum/itemType"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ConditionMessages } from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class CloseItemAction extends Action {
  private static getItem(request: Request) {
    return request.mob.inventory.findItemByName(request.getSubject())
  }

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
        () => CloseItemAction.getItem(request),
        ConditionMessages.Close.Fail.NotFound)
      .capture()
      .require(
        (item: ItemEntity) => item.itemType === ItemType.Container,
        ConditionMessages.Close.Fail.ItemIsNotAContainer)
      .require(
        (item: ItemEntity) => item.container.isOpen,
        ConditionMessages.Close.Fail.AlreadyClosed)
      .require((item: ItemEntity) => item.container.isCloseable,
        ConditionMessages.Close.Fail.CannotClose)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult<ItemEntity>()
    item.container.isOpen = false

    return requestService.respondWith().success(
      Messages.CloseContainer.Success,
      {
          closeVerb: "close",
          item: item.name,
        },
      {
          closeVerb: "closes",
          item: item.name,
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
