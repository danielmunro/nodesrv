import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class DirectiveActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.Directive
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): void {
    const position = actionParts.indexOf(ActionPart.Directive)
    const directive = request.getWord(position)
    checkBuilder.require(
      directive,
      "What was that?",
      CheckType.Directive)
  }
}
