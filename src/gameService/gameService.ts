import Action from "../action/action"
import Skill from "../action/impl/skill"
import Spell from "../action/impl/spell"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import {Room} from "../room/model/room"
import {SkillType} from "../skill/skillType"
import {SpellType} from "../spell/spellType"
import ActionService from "./actionService"

export default class GameService {
  constructor(
    private readonly mobService: MobService,
    private readonly actionService: ActionService) {}

  public async moveMob(mob: Mob, direction: Direction) {
    await this.mobService.moveMob(mob, direction)
  }

  public getMobLocation(mob: Mob): MobLocation {
    return this.mobService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.getMobsByRoom(room)
  }

  public getActions(): Action[] {
    return this.actionService.actions
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

  public getSpell(spellType: SpellType): Spell {
    const found = this.actionService.spells.find(spell => spell.getSpellType() === spellType)
    if (!found) {
      throw new Error(`unknown spell for ${spellType}`)
    }
    return found
  }
}
