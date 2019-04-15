import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import MobService from "../../mob/mobService"
import Request from "../../request/request"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"

export default class HostileActionPartCheck implements ActionPartCheck {
  constructor(private readonly mobService: MobService) {}

  public getActionPart(): ActionPart {
    return ActionPart.Hostile
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request): any {
    if (this.mobService.findFight(fight => fight.isParticipant(request.mob))) {
      checkBuilder.requireFight()
      return
    }
    checkBuilder.requireMob(ConditionMessages.All.Mob.NotFound)
  }
}
