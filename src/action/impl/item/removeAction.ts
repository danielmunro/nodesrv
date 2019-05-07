import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/checkType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {ResponseStatus} from "../../../request/responseStatus"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages, MESSAGE_REMOVE_FAIL, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class RemoveAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
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
    const item = requestService.getResult()
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
