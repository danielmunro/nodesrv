import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import ItemService from "../../../item/service/itemService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages, Messages as ActionMessages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

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

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult(CheckType.HasItem)

    return requestService.respondWith().success(
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
