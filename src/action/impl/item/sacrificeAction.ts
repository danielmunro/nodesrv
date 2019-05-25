import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/service/eventService"
import {Item} from "../../../item/model/item"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import {ConditionMessages, MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class SacrificeAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .not()
      .requireAffect(AffectType.NoSacrifice, ConditionMessages.All.Item.CannotSacrifice)
      .require((item: Item) => item.isContainer()
        ? item.container.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    requestService.removeItemFromRoomInventory()
    const item = requestService.getResult()
    const value = Math.max(1, item.value / 10)
    requestService.addGold(value)
    await this.eventService.publish(
      requestService.createItemEvent(EventType.ItemDestroyed, item))
    return requestService
      .respondWith()
      .success(format(Messages.Sacrifice.Success, item.name, value))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInRoom ]
  }

  public getRequestType(): RequestType {
    return RequestType.Sacrifice
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
