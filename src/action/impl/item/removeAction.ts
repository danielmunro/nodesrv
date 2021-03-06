import {inject, injectable} from "inversify"
import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../messageExchange/enum/responseStatus"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {ConditionMessages, MESSAGE_REMOVE_FAIL, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class RemoveAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const item = request.mob.equipped.findItemByName(request.getContextAsInput().subject)
    const replacement = item ? item.toString() : null
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(item, MESSAGE_REMOVE_FAIL, CheckType.HasItem)
      .capture()
      .not().requireAffect(AffectType.NoRemove,
        format(ConditionMessages.All.Item.NoRemoveItem, replacement))
      .not().requireAffect(AffectType.Curse,
        format(ConditionMessages.All.Item.CannotRemoveCursedItem, replacement))
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult<ItemEntity>()
    requestService.getMob().equipped.removeItem(item)
    return requestService.respondWith()
      .response(
        ResponseStatus.Info,
        requestService.createResponseMessage(ConditionMessages.Remove.Success)
          .addReplacement("item", item.name)
          .setVerbToRequestCreator("remove")
          .addReplacementForRequestCreator("verb2", "put")
          .addReplacementForRequestCreator("requestCreator2", "your")
          .setVerbToTarget("remove")
          .addReplacementForTarget("verb2", "put")
          .addReplacementForTarget("requestCreator2", "your")
          .setVerbToObservers("removes")
          .addReplacementForObservers("verb2", "puts")
          .addReplacementForObservers("requestCreator2", "their")
          .create())
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInEquipment ]
  }

  public getRequestType(): RequestType {
    return RequestType.Remove
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
