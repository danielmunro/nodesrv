import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import MobService from "../../mob/service/mobService"
import Request from "../../request/request"
import CheckBuilder from "../builder/checkBuilder"
import ActionPartCheck from "./actionPartCheck"

export default class HostileActionPartCheck implements ActionPartCheck {
  constructor(private readonly mobService: MobService) {}

  public getActionPart(): ActionPart {
    return ActionPart.Hostile
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    if (this.mobService.findFightForMob(request.mob).get()) {
      checkBuilder.requireFight()
      return
    }
    checkBuilder.requireMobInRoom(ConditionMessages.All.Mob.NotFound)
  }
}
