import {Messages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../request/request"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"
import {CheckType} from "../checkType"

export default class GoldActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.GoldOnHand
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    checkBuilder.require(
      request.getComponent(),
      Messages.Bounty.NeedAmount,
      CheckType.HasArguments)
    .require(
      (amount: number) => request.mob.gold >= amount,
      Messages.Bounty.NeedMoreGold)
  }
}
