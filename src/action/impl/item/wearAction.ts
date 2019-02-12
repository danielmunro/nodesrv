import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import {Inventory} from "../../../item/model/inventory"
import {Item} from "../../../item/model/item"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class WearAction extends Action {
  private static wear(inventory: Inventory, equipped: Inventory, item: Item, currentlyEquipped?: Item): string {
    let removal = ""

    if (currentlyEquipped) {
      inventory.addItem(currentlyEquipped)
      removal = ` remove ${currentlyEquipped.name} and`
    }

    equipped.addItem(item)

    return `You${removal} wear ${item.name}.`
  }

  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.mob.inventory.findItemByName(request.getSubject()),
        ConditionMessages.All.Item.NotOwned,
        CheckType.HasItem)
      .capture()
      .require((item: Item) => !!item.equipment, ConditionMessages.All.Item.NotEquipment)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
    const mob = checkedRequest.mob

    return checkedRequest.respondWith().success(
      WearAction.wear(
        mob.inventory,
        mob.equipped,
        checkedRequest.getCheckTypeResult(CheckType.HasItem),
        mob.equipped.find((i: Item) => i.equipment === item.equipment)))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Wear
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
