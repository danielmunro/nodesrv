import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import ItemEvent from "../../../item/event/itemEvent"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"

export default class SacrificeAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(request.findItemInRoomInventory(), ConditionMessages.All.Item.NotFound)
      .capture()
      .not()
      .requireAffect(AffectType.NoSacrifice, ConditionMessages.All.Item.CannotSacrifice)
      .require(item => item.isContainer()
        ? item.container.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.check.result
    const room = checkedRequest.request.getRoom()
    room.inventory.removeItem(item)
    const value = Math.max(1, item.value / 10)
    checkedRequest.request.mob.gold += value
    await this.eventService.publish(new ItemEvent(EventType.ItemDestroyed, item))

    return checkedRequest
      .respondWith()
      .success(Messages.Sacrifice.Success, item.name, value)
  }

  protected getRequestType(): RequestType {
    return RequestType.Sacrifice
  }
}
