import {cloneDeep} from "lodash"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import ItemEvent from "../../../item/event/itemEvent"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {MESSAGE_ERROR_NO_ITEM, Messages as ActionMessages} from "../../constants"
import {ConditionMessages} from "../../constants"

export default class BuyAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const subject = request.getSubject()
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(subject, ConditionMessages.All.Arguments.Buy)
      .requireMerchant()
      .require(mob => mob.inventory.findItemByName(subject), MESSAGE_ERROR_NO_ITEM, CheckType.HasItem)
      .capture()
      .require(item => request.mob.gold > item.value, ConditionMessages.Buy.CannotAfford)
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const item = cloneDeep(checkedRequest.check.result)
    request.mob.inventory.addItem(item)
    request.mob.gold -= item.value
    await this.eventService.publish(new ItemEvent(EventType.ItemCreated, item))
    const replacements = {
      item,
      value: item.value,
    }
    return request
      .respondWith()
      .success(ActionMessages.Buy.Success,
        { verb: "buy", ...replacements },
        { verb: "buys", ...replacements })
  }

  protected getRequestType(): RequestType {
    return RequestType.Buy
  }
}
