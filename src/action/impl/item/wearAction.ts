import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {Item} from "../../../item/model/item"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Action from "../../action"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class WearAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .require((item: Item) => !!item.equipment, ConditionMessages.All.Item.NotEquipment)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult()
    const mob = requestService.getMob()
    const currentEq = mob.equipped.find((i: Item) => i.equipment === item.equipment)

    if (currentEq) {
      mob.inventory.addItem(currentEq)
    }
    mob.equipped.addItem(item)

    return requestService.respondWith().response(
      ResponseStatus.Success,
      requestService.createResponseMessage(Messages.Wear.Success)
        .addReplacement("item", item.name)
        .setVerbToRequestCreator("wear")
        .addReplacementForRequestCreator("removeClause", currentEq ? ` remove ${currentEq.name} and` : "")
        .setVerbToTarget("wear")
        .addReplacementForTarget("removeClause", currentEq ? ` remove ${currentEq.name} and` : "")
        .setVerbToObservers("wears")
        .addReplacementForObservers("removeClause", currentEq ? ` removes ${currentEq.name} and` : "")
        .create())
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Wear
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
