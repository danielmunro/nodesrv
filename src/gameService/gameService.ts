import Action from "../action/action"
import getActionTable from "../action/actionTable"
import Skill from "../action/skill"
import Spell from "../action/spell"
import Event from "../event/event"
import EventResponse from "../event/eventResponse"
import EventService from "../event/eventService"
import ItemService from "../item/itemService"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import {Room} from "../room/model/room"
import {default as RoomTable} from "../room/roomTable"
import {getSkillTable} from "../skill/skillTable"
import {SkillType} from "../skill/skillType"
import getSpellTable from "../spell/spellTable"
import {SpellType} from "../spell/spellType"
import TimeService from "./timeService"

export default class GameService {
  public readonly timeService: TimeService
  private readonly actions: Action[]
  private readonly skillTable: Skill[]
  private readonly spellTable: Spell[]

  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemService: ItemService,
    public readonly eventService: EventService,
    time = 0) {
    this.timeService = new TimeService(time)
    this.skillTable = getSkillTable(this)
    this.spellTable = getSpellTable(this)
    this.actions = getActionTable(this)
  }

  public async moveMob(mob: Mob, direction: Direction) {
    await this.mobService.locationService.moveMob(mob, direction)
  }

  public getMobLocation(mob: Mob) {
    return this.mobService.locationService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.locationService.getMobsByRoom(room)
  }

  public publishEvent(event: Event): Promise<EventResponse> {
    return this.eventService.publish(event)
  }

  public getActions(): Action[] {
    return this.actions
  }

  public getAction(requestType: RequestType): Action {
    const found = this.actions.find(action => action.isAbleToHandleRequestType(requestType))
    if (!found) {
      throw new Error(`unknown action for ${requestType}`)
    }
    return found
  }

  public getSkill(skillType: SkillType): Skill {
    const found = this.skillTable.find(skill => skill.getSkillType() === skillType)
    if (!found) {
      throw new Error(`unknown skill for ${skillType}`)
    }
    return found
  }

  public getSpell(spellType: SpellType): Spell {
    const found = this.spellTable.find(spell => spell.getSpellType() === spellType)
    if (!found) {
      throw new Error(`unknown spell for ${spellType}`)
    }
    return found
  }
}
