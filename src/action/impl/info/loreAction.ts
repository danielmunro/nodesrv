import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import ItemService from "../../../item/itemService"
import Request from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages, Messages as ActionMessages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class LoreAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mobInventory = request.mob.inventory
    const item = this.itemService.findItem(mobInventory, request.getSubject())

    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(item, ConditionMessages.All.Item.NotFound, CheckType.HasItem)
      .require(item.identified, ConditionMessages.Lore.FailNotIdentified)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)

    return checkedRequest.respondWith().success(
      ActionMessages.Lore.Success,
      {
        item,
        level: item.level,
        value: item.value,
        weight: item.weight,
      })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Lore
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
