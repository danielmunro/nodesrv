import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"

export default class MobInRoomActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.MobInRoom
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder): any {
    checkBuilder.requireMob(ConditionMessages.All.Mob.NotFound)
  }
}
