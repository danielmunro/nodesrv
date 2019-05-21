import {cloneDeep} from "lodash"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/eventService"
import {Item} from "../../../item/model/item"
import {Disposition} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {ConditionMessages, Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class BuyAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .require(subject, ConditionMessages.All.Arguments.Buy)
      .requireMerchant()
      .require((mob: Mob) =>
        mob.inventory.findItemByName(subject), ConditionMessages.Buy.MerchantNoItem, CheckType.HasItem)
      .capture()
      .require((item: Item) => request.mob.gold >= item.value, ConditionMessages.Buy.CannotAfford)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const item = cloneDeep(requestService.getResult())
    requestService.addItemToMobInventory(item)
    requestService.subtractGold(item.value)
    await this.eventService.publish(
      requestService.createItemEvent(EventType.ItemCreated, item))
    const replacements = {
      item,
      value: item.value,
    }
    return requestService
      .respondWith()
      .success(ActionMessages.Buy.Success,
        { verb: "buy", ...replacements },
        { verb: "buys", ...replacements })
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
