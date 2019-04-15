import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import ItemEvent from "../../../item/event/itemEvent"
import {Item} from "../../../item/model/item"
import MobEvent from "../../../mob/event/mobEvent"
import Request from "../../../request/request"
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

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.check.result as Item

    if (item.affect().has(AffectType.MeltDrop)) {
      await this.eventService.publish(new ItemEvent(EventType.ItemDestroyed, item))
    } else {
      checkedRequest.room.inventory.addItem(item)
    }

    await this.eventService.publish(new MobEvent(EventType.ItemDropped, checkedRequest.mob, item))

    return checkedRequest.respondWith().success(
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
