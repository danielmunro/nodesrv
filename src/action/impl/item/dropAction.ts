import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/eventService"
import {Item} from "../../../item/model/item"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class DropAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireSubject(ConditionMessages.All.Arguments.Drop)
      .requireFromActionParts(request, this.getActionParts())
      .not().requireAffect(AffectType.Curse, ConditionMessages.All.Item.CannotRemoveCursedItem)
      .require(
        (item: Item) => item.isTransferable,
        ConditionMessages.All.Item.NotTransferrable)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult() as Item

    if (item.affect().has(AffectType.MeltDrop)) {
      await this.eventService.publish(
        requestService.createItemEvent(EventType.ItemDestroyed, item))
    } else {
      requestService.addItemToRoomInventory(item)
    }

    await this.eventService.publish(
      requestService.createMobEvent(EventType.ItemDropped, item))

    return requestService.respondWith().success(
      Messages.Drop.Success,
      { item, verb: "drop" },
      { item, verb: "drops" })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Drop
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
