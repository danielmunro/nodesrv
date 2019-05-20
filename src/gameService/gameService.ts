import {inject, injectable} from "inversify"
import "reflect-metadata"
import Action from "../action/action"
import Skill from "../action/impl/skill"
import Move from "../action/move"
import {Mob} from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import MobService from "../mob/service/mobService"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import {Room} from "../room/model/room"
import {SkillType} from "../skill/skillType"
import {Types} from "../support/types"
import ActionService from "./actionService"

@injectable()
export default class GameService {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.ActionService) private readonly actionService: ActionService) {}

  public async moveMob(mob: Mob, direction: Direction) {
    await this.mobService.moveMob(mob, direction)
  }

  public getMobLocation(mob: Mob): MobLocation {
    return this.mobService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.getMobsByRoom(room)
  }

  public getActionService(): ActionService {
    return this.actionService
  }

  public getActions(): Action[] {
    return this.actionService.actions
  }

  public getMovementActions(): Move[] {
    return this.actionService.actions.filter((action: Action) => action instanceof Move) as Move[]
  }

  public getAction(requestType: RequestType): Action {
    const found = this.actionService.actions.find(action => action.isAbleToHandleRequestType(requestType))
    if (!found) {
      throw new Error(`unknown action for ${requestType}`)
    }
    return found
  }

  public getSkill(skillType: SkillType): Skill {
    const found = this.actionService.skills.find(skill => skill.getSkillType() === skillType)
    if (!found) {
      throw new Error(`unknown skill for ${skillType}`)
    }
    return found
  }
}
