import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../messageExchange/enum/responseStatus"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class WearAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .require((item: ItemEntity) => !!item.equipment, ConditionMessages.All.Item.NotEquipment)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const item = requestService.getResult<ItemEntity>()
    const mob = requestService.getMob()
    const currentEq = mob.equipped.find((i: ItemEntity) => i.equipment === item.equipment)

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
