import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {EventType} from "../../../event/enum/eventType"
import EventService from "../../../event/service/eventService"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class EatAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireSubject(ConditionMessages.All.Arguments.Eat)
      .requireFromActionParts(request, this.getActionParts())
      .require((item: ItemEntity) => item.isFood(), ConditionMessages.Eat.NotFood)
      .require(request.mob.playerMob.hunger < request.mob.race().appetite, ConditionMessages.Eat.AlreadyFull)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const item = requestService.getResult<ItemEntity>()
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
