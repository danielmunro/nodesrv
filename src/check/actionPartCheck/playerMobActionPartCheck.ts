import {ActionPart} from "../../action/enum/actionPart"
import MobService from "../../mob/mobService"
import {Mob} from "../../mob/model/mob"
import {Request} from "../../request/request"
import ActionPartCheck from "../actionPartCheck"
import CheckBuilder from "../checkBuilder"

export default class PlayerMobActionPartCheck implements ActionPartCheck {
  constructor(private readonly mobService: MobService) {}

  public getActionPart(): ActionPart {
    return ActionPart.PlayerMob
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): any {
    const index = actionParts.indexOf(ActionPart.PlayerMob)
    const lookup = index === 1 ? request.getSubject() : request.getComponent()
    checkBuilder.requirePlayer(this.mobService.mobTable.getMobs().find(mob => mob.name === lookup) as Mob)
  }
}
