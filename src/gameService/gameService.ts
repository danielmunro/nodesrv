import {inject, injectable} from "inversify"
import "reflect-metadata"
import Action from "../action/impl/action"
import Move from "../action/impl/move"
import Skill from "../action/impl/skill"
import ActionService from "../action/service/actionService"
import {MobEntity} from "../mob/entity/mobEntity"
import MobLocationEntity from "../mob/entity/mobLocationEntity"
import MobService from "../mob/service/mobService"
import {SkillType} from "../mob/skill/skillType"
import {RequestType} from "../request/enum/requestType"
import {RoomEntity} from "../room/entity/roomEntity"
import {Direction} from "../room/enum/direction"
import {Types} from "../support/types"

@injectable()
export default class GameService {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.ActionService) private readonly actionService: ActionService) {}

  public async moveMob(mob: MobEntity, direction: Direction) {
    await this.mobService.moveMob(mob, direction)
  }

  public getMobLocation(mob: MobEntity): MobLocationEntity {
    return this.mobService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: RoomEntity): MobEntity[] {
    return this.mobService.getMobsByRoom(room)
  }

  public getActions(): Action[] {
    return this.actionService.actionTable
  }

  public getMovementActions(): Move[] {
    return this.actionService.actions.filter((action: Action) => action instanceof Move) as Move[]
  }

  public getAction(requestType: RequestType): Action {
    const found = this.actionService.actionTable.find(action => action.isAbleToHandleRequestType(requestType)) ||
      this.actionService.actions.find(action => action.isAbleToHandleRequestType(requestType))
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
