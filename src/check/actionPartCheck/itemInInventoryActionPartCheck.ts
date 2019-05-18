import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../request/request"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"
import {CheckType} from "../enum/checkType"

export default class ItemInInventoryActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.ItemInInventory
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    checkBuilder.require(
      request.mob.inventory.findItemByName(request.getSubject()),
      ConditionMessages.All.Item.NotOwned,
      CheckType.HasItem)
      .capture()
  }
}
