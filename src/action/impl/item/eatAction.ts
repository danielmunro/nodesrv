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
import {ConditionMessages, Messages} from "../../constants"
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
      .requireFromActionParts(request, this.getActionParts())
      .require((item: Item) => item.isFood(), ConditionMessages.Eat.NotFood)
      .require(request.mob.playerMob.hunger < request.mob.race().appetite, ConditionMessages.Eat.AlreadyFull)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const item = requestService.getResult()
    mob.playerMob.eat(item)
    requestService.removeItemFromMobInventory()
    const affects = item.affects.length > 0 ? ", and suddenly feel different" : ""
    const full = mob.playerMob.hunger === mob.playerMob.appetite ? ". You feel full" : ""
    const replacements = { item, affects }
    await this.eventService.publish(
      requestService.createItemEvent(EventType.ItemDestroyed, item))

    return requestService
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
