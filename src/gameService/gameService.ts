import Action from "../action/action"
import getActionTable from "../action/actionTable"
import Skill from "../action/skill"
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
import Spell from "../spell/spell"
import getSpellTable from "../spell/spellTable"
import {SpellType} from "../spell/spellType"
import DefinitionService from "./definitionService"
import TimeService from "./timeService"

export default class GameService {
  public readonly timeService: TimeService
  private actions: Action[]
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

  public definition(): DefinitionService {
    return new DefinitionService(this)
  }

  public publishEvent(event: Event): Promise<EventResponse> {
    return this.eventService.publish(event)
  }

  public getActions(): Action[] {
    if (!this.actions) {
      this.actions = getActionTable(this)
    }
    return this.actions
  }

  public async getActionDefinition(requestType: RequestType): Promise<Action> {
    return this.getActions().find(action => action.isAbleToHandleRequestType(requestType))
  }

  public getSkillDefinition(skillType: SkillType): Skill {
    return this.skillTable.find(skill => skill.getSkillType() === skillType)
  }

  public getSpellDefinition(spellType: SpellType): Spell {
    return this.spellTable.find(spell => spell.spellType === spellType)
  }
}
