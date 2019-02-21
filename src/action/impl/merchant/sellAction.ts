import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import ItemEvent from "../../../item/event/itemEvent"
import {Item} from "../../../item/model/item"
import {Disposition} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages, Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

function sell(mob: Mob, item: Item) {
  mob.inventory.removeItem(item)
  mob.gold += item.value

  return format(ActionMessages.Sell.Success, item.name, item.value)
}

export default class SellAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .require(
        request.mob.inventory.findItemByName(request.getSubject()),
        ConditionMessages.All.Item.NotOwned,
        CheckType.HasItem)
      .capture()
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    await this.eventService.publish(new ItemEvent(EventType.ItemDestroyed, item))

    return checkedRequest
      .respondWith()
      .success(sell(checkedRequest.mob, item))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Sell
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
