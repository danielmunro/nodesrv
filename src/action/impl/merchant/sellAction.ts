import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import {createItemEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../messageExchange/enum/responseStatus"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class SellAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .requireFromActionParts(request, this.getActionParts())
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult<ItemEntity>(CheckType.HasItem)
    await this.eventService.publish(createItemEvent(EventType.ItemDestroyed, item))
    requestService.removeItemFromMobInventory(item)
    requestService.addGold(item.value)

    return requestService
      .respondWith()
      .response(
        ResponseStatus.Success,
        requestService.createResponseMessage(ActionMessages.Sell.Success)
          .addReplacement("item", item.toString())
          .addReplacement("value", item.value.toString())
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
