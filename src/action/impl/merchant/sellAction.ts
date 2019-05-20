import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/eventService"
import {createItemEvent} from "../../../event/factory"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class SellAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .requireFromActionParts(request, this.getActionParts())
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult(CheckType.HasItem)
    await this.eventService.publish(createItemEvent(EventType.ItemDestroyed, item))
    requestService.removeItemFromMobInventory(item)
    requestService.addGold(item.value)

    return requestService
      .respondWith()
      .response(
        ResponseStatus.Success,
        requestService.createResponseMessage(ActionMessages.Sell.Success)
          .addReplacement("item", item)
          .addReplacement("value", item.value)
          .setVerbToRequestCreator("sell")
          .setVerbToTarget("sell")
          .setVerbToObservers("sells")
          .create())
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
