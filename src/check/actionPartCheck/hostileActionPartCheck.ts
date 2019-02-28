import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"

export default class HostileActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.Hostile
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder): any {
    checkBuilder.requireMob(ConditionMessages.All.Mob.NotFound)
  }
}
