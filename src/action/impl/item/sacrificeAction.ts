import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import {Item} from "../../../item/model/item"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages, MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

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
