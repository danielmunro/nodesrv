import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../request/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class ExpirationYearActionPartCheck implements ActionPartCheck {
  private static isValidValue(expirationYear: number): boolean {
    const year = new Date().getFullYear()
    return expirationYear >= year && expirationYear < year + 10
  }

  public getActionPart(): ActionPart {
    return ActionPart.ExpYear
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    const expirationYear = parseInt(request.getWord(4), 10)
    checkBuilder.require(
      expirationYear,
      "expiration year required",
      CheckType.ExpirationYear)
      .capture()
      .require(ExpirationYearActionPartCheck.isValidValue(expirationYear), "expiration year must be valid")
  }
}
