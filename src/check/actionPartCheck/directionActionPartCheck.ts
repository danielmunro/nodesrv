import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import {allDirections} from "../../room/constants"
import {Direction} from "../../room/enum/direction"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class DirectionActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.Direction
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): any {
    const position = actionParts.indexOf(ActionPart.Direction)
    const direction = request.getWord(position) as Direction
    const room = request.getRoom()
    checkBuilder.require(
      direction,
      "direction is required",
      CheckType.Direction)
      .require(allDirections.includes(direction), "that is not a valid direction")
      .require(room.exits.find(exit => exit.direction === direction), "a room does not exist in that direction")
      .capture()
  }
}
