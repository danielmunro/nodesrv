import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class ItemInInventoryActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.ItemInInventory
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): void {
    const position = actionParts.indexOf(ActionPart.ItemInInventory)
    const subject = request.getWord(position)
    checkBuilder.require(
      request.mob.inventory.findItemByName(subject),
      ConditionMessages.All.Item.NotOwned,
      CheckType.HasItem)
      .capture()
  }
}
