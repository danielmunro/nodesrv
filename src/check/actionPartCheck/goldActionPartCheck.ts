import {Messages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import CheckBuilder from "../builder/checkBuilder"
import {CheckType} from "../enum/checkType"
import ActionPartCheck from "./actionPartCheck"

export default class GoldActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.GoldOnHand
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): void {
    const component = parseInt(request.getComponent(), 10)
    checkBuilder.require(
      component,
      Messages.Bounty.NeedAmount,
      CheckType.HasGold)
    .require(
      (amount: number) => request.mob.gold >= amount,
      Messages.Bounty.NeedMoreGold)
  }
}
