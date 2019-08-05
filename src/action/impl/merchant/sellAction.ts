import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import {createItemEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
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
