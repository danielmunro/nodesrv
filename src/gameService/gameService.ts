import Event from "../event/event"
import MobEvent from "../event/event/mobEvent"
import createEventConsumerTable from "../event/eventConsumerTable"
import {EventResponse} from "../event/eventResponse"
import EventService from "../event/eventService"
import {EventType} from "../event/eventType"
import ItemService from "../item/itemService"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"
import {Mob} from "../mob/model/mob"
import {Direction} from "../room/constants"
import ExitTable from "../room/exitTable"
import {Room} from "../room/model/room"
import {default as RoomTable} from "../room/roomTable"
import DefinitionService from "./definitionService"
import TimeService from "./timeService"

export default class GameService {
  public static async new(
    mobService: MobService,
    itemService: ItemService,
    roomTable: RoomTable = new RoomTable({}),
    exitTable: ExitTable = new ExitTable(mobService.locationService, []),
    time: number = 0,
  ): Promise<GameService> {
    return new GameService(
      mobService, roomTable, itemService, exitTable, time)
  }

  private readonly timeService: TimeService
  private readonly eventService: EventService

  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemService: ItemService,
    public readonly exitTable: ExitTable,
    time = 0) {
    this.timeService = new TimeService(time)
    this.eventService = new EventService(createEventConsumerTable(mobService, new FightBuilder(this)))
  }

  public incrementTime() {
    this.timeService.incrementTime()
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

    this.eventService.publish(new MobEvent(EventType.MobLeft, mob))
    const destination = this.roomTable.get(exit.destination.uuid)
    this.mobService.locationService.updateMobLocation(mob, destination)
    this.eventService.publish(new MobEvent(EventType.MobArrived, mob))
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

  public publishEvent(event: Event): EventResponse {
    return this.eventService.publish(event)
  }
}
