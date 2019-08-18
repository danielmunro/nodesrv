import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class NameActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.Name
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): void {
    const position = actionParts.indexOf(ActionPart.Name)
    const name = request.getWord(position)
    checkBuilder.require(
      name,
      "What was that?",
      CheckType.Name)
  }
}
