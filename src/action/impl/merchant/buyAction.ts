import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/service/eventService"
import {ItemEntity} from "../../../item/entity/itemEntity"
import ItemService from "../../../item/service/itemService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class BuyAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(subject, ConditionMessages.All.Arguments.Buy)
      .requireMerchant()
      .require((mob: MobEntity) =>
        mob.inventory.findItemByName(subject), ConditionMessages.Buy.MerchantNoItem, CheckType.HasItem)
      .capture()
      .require((item: ItemEntity) => request.mob.gold >= item.value, ConditionMessages.Buy.CannotAfford)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const targetItem = requestService.getResult<ItemEntity>()
    const item = ItemService.cloneItem(targetItem)
    requestService.addItemToMobInventory(item)
    requestService.subtractGold(item.value)
    await this.eventService.publish(
      requestService.createItemEvent(EventType.ItemCreated, item))
    return requestService
      .respondWith()
      .okWithMessage(
        requestService.createResponseMessage(ActionMessages.Buy.Success)
          .setVerbToRequestCreator("buy")
          .setVerbToTarget("buys")
          .setVerbToObservers("buys")
          .addReplacement("item", item.brief)
          .addReplacement("value", item.value.toString()))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemWithRoomMob ]
  }

  public getRequestType(): RequestType {
    return RequestType.Buy
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
