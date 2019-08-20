import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class NumberActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.Amount
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): void {
    const position = actionParts.indexOf(ActionPart.Amount)
    const name = request.getWord(position)
    checkBuilder.require(
      parseInt(name, 10),
      "How much was that?",
      CheckType.Amount)
  }
}
