import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Request from "../../messageExchange/request"
import MobService from "../../mob/service/mobService"
import CheckBuilder from "../builder/checkBuilder"
import ActionPartCheck from "./actionPartCheck"

export default class HostileActionPartCheck implements ActionPartCheck {
  constructor(private readonly mobService: MobService) {}

  public getActionPart(): ActionPart {
    return ActionPart.Hostile
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): void {
    if (this.mobService.findFightForMob(request.mob).get()) {
      checkBuilder.requireFight()
      return
    }
    checkBuilder.requireMobInRoom(ConditionMessages.All.Mob.NotFound)
  }
}
