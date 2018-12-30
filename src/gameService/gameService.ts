import actionCollection from "../action/actionCollection"
import {Collection} from "../action/definition/collection"
import {Definition} from "../action/definition/definition"
import Event from "../event/event"
import EventResponse from "../event/eventResponse"
import EventService from "../event/eventService"
import {EventType} from "../event/eventType"
import ItemService from "../item/itemService"
import MobEvent from "../mob/event/mobEvent"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import ExitTable from "../room/exitTable"
import {Room} from "../room/model/room"
import {default as RoomTable} from "../room/roomTable"
import SkillDefinition from "../skill/skillDefinition"
import {getSkillTable} from "../skill/skillTable"
import {SkillType} from "../skill/skillType"
import DefinitionService from "./definitionService"
import TimeService from "./timeService"

export default class GameService {
  public readonly timeService: TimeService
  private eventService: EventService
  private actionCollection: Collection
  private readonly skillTable: SkillDefinition[]

  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemService: ItemService,
    public readonly exitTable: ExitTable,
    time = 0) {
    this.timeService = new TimeService(time)
    this.skillTable = getSkillTable(this)
  }

  public setEventService(eventService: EventService) {
    this.eventService = eventService
  }

  public getCurrentTime() {
    return this.timeService.getCurrentTime()
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const exits = this.exitTable.exitsForMob(mob)
    const exit = exits.find(e => e.direction === direction)

    if (!exit) {
      throw new Error("cannot move in that direction")
    }

    const source = this.roomTable.get(exit.source.uuid)
    const destination = this.roomTable.get(exit.destination.uuid)
    this.mobService.locationService.updateMobLocation(mob, destination)
    await this.eventService.publish(new MobEvent(EventType.MobLeft, mob, source))
    await this.eventService.publish(new MobEvent(EventType.MobArrived, mob, destination))
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

  public getActionCollection(): Collection {
    if (!this.actionCollection) {
      this.actionCollection = actionCollection(this)
    }
    return this.actionCollection
  }

  public async getActionDefinition(requestType: RequestType): Promise<Definition> {
    return this.getActionCollection().getMatchingHandlerDefinitionForRequestType(requestType)
  }

  public getSkillDefinition(skillType: SkillType): SkillDefinition {
    return this.skillTable.find(skill => skill.skillType === skillType)
  }
}
