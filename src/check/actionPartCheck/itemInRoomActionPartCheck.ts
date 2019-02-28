import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import {Request} from "../../request/request"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"
import {CheckType} from "../checkType"

export default class ItemInRoomActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.ItemInRoom
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    checkBuilder.require(
      request.room.inventory.findItemByName(request.getSubject()),
      ConditionMessages.All.Item.NotOwned,
      CheckType.HasItem)
      .capture()
  }
}
