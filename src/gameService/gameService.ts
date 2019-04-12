import Action from "../action/action"
import Skill from "../action/impl/skill"
import Spell from "../action/impl/spell"
import Event from "../event/event"
import EventConsumer from "../event/eventConsumer"
import EventResponse from "../event/eventResponse"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import WeatherService from "../region/weatherService"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import {Room} from "../room/model/room"
import {default as RoomTable} from "../room/roomTable"
import {SkillType} from "../skill/skillType"
import {SpellType} from "../spell/spellType"
import ActionService from "./actionService"
import StateService from "./stateService"
import TimeService from "./timeService"

export default class GameService {
  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    private readonly eventService: EventService,
    private readonly actionService: ActionService,
    private readonly stateService: StateService) {}

  public addEventConsumer(eventConsumer: EventConsumer) {
    this.eventService.addConsumer(eventConsumer)
  }

  public getTimeService(): TimeService {
    return this.stateService.timeService
  }

  public getWeatherService(): WeatherService {
    return this.stateService.weatherService
  }

  public async moveMob(mob: Mob, direction: Direction) {
    await this.mobService.locationService.moveMob(mob, direction)
  }

  public getMobLocation(mob: Mob): MobLocation {
    return this.mobService.locationService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.locationService.getMobsByRoom(room)
  }

  public publishEvent(event: Event): Promise<EventResponse> {
    return this.eventService.publish(event)
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
