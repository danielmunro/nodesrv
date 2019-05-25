import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import CheckBuilder from "../builder/checkBuilder"
import ActionPartCheck from "./actionPartCheck"

export default class MobInRoomActionPartCheck implements ActionPartCheck {
  public getActionPart(): ActionPart {
    return ActionPart.MobInRoom
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder): any {
    checkBuilder.requireMobInRoom(ConditionMessages.All.Mob.NotFound)
  }
}
