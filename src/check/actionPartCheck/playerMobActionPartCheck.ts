import {ActionPart} from "../../action/enum/actionPart"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobService from "../../mob/service/mobService"
import Request from "../../request/request"
import CheckBuilder from "../builder/checkBuilder"
import ActionPartCheck from "./actionPartCheck"

export default class PlayerMobActionPartCheck implements ActionPartCheck {
  constructor(private readonly mobService: MobService) {}

  public getActionPart(): ActionPart {
    return ActionPart.PlayerMob
  }

  public addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): any {
    const index = actionParts.indexOf(ActionPart.PlayerMob)
    const lookup = index === 1 ? request.getSubject() : request.getComponent()
    checkBuilder.requirePlayer(this.mobService.mobTable.getMobs().find(mob => mob.name === lookup) as MobEntity)
  }
}
