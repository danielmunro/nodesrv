import ItemTable from "../item/itemTable"
import MobService from "../mob/mobService"
import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import ExitTable from "../room/exitTable"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import DefinitionService from "./definitionService"
import TimeService from "./timeService"

export default class GameService {
  public static async new(
    mobService: MobService,
    roomTable: RoomTable = new RoomTable({}),
    itemTable: ItemTable = new ItemTable([]),
    exitTable: ExitTable = new ExitTable(mobService.locationService, []),
    time: number = 0,
  ): Promise<GameService> {
    return new GameService(
      mobService, roomTable, itemTable, exitTable, time)
  }

  private timeService: TimeService

  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemTable: ItemTable,
    public readonly exitTable: ExitTable,
    time = 0) {
    this.timeService = new TimeService(time)
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

    const destination = this.roomTable.get(exit.destination.uuid)

    return this.mobService.locationService.updateMobLocation(mob, destination)
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
}
