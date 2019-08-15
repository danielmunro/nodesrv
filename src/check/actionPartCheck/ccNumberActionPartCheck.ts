import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class CcNumberActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.CCNumber
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    const ccNumber = request.getComponent()
    checkBuilder.require(
      ccNumber,
      "CC number required",
      CheckType.CCNumber)
      .capture()
  }
}
