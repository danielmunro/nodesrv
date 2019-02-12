import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {format} from "../../../support/string"
import Action from "../../action"
import {ConditionMessages} from "../../constants"
import {MESSAGE_REMOVE_FAIL} from "../../constants"
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

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    checkedRequest.request.mob.inventory.addItem(item)

    return checkedRequest.respondWith().info(format(ConditionMessages.Remove.Success, item.name))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInEquipment ]
  }

  public getRequestType(): RequestType {
    return RequestType.Remove
  }
}
