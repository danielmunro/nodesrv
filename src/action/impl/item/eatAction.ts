import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import ItemEvent from "../../../item/event/itemEvent"
import {Item} from "../../../item/model/item"
import appetite from "../../../mob/race/appetite"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class EatAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireSubject(ConditionMessages.All.Arguments.Eat)
      .require(request.findItemInSessionMobInventory(), ConditionMessages.All.Item.NotOwned)
      .capture()
      .require((item: Item) => item.isFood(), ConditionMessages.Eat.NotFood)
      .require(request.mob.playerMob.hunger < appetite(request.mob.race), ConditionMessages.Eat.AlreadyFull)
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.request.mob
    const item = checkedRequest.check.result as Item

    mob.playerMob.eat(item)
    mob.inventory.removeItem(item)

    const affects = item.affects.length > 0 ? ", and suddenly feel different" : ""
    const full = mob.playerMob.hunger === mob.playerMob.appetite ? ". You feel full" : ""
    const replacements = { item, affects }
    await this.eventService.publish(new ItemEvent(EventType.ItemDestroyed, item))

    return checkedRequest
      .respondWith()
      .success(
        Messages.Eat.Success,
        { verb: "eat", full, ...replacements },
        { verb: "eats", full: "", ...replacements })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Eat
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
