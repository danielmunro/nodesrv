import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../request/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class ExpirationMonthActionPartCheck implements ActionPartCheck {
  private static isValidValue(expirationMonth: number): boolean {
    return expirationMonth > 0 && expirationMonth < 13
  }

  public getActionPart(): ActionPart {
    return ActionPart.ExpMonth
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    const expirationMonth = parseInt(request.getContextAsInput().words[3], 10)
    checkBuilder.require(
      expirationMonth,
      "expiration month required and must be a number between 1-12",
      CheckType.ExpirationMonth)
      .capture()
      .require(ExpirationMonthActionPartCheck.isValidValue(expirationMonth), "expiration month must be between 1-12")
  }
}
