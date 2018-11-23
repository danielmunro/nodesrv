import { Definition } from "../action/definition/definition"
import ItemTable from "../item/itemTable"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import { default as MobTable } from "../mob/mobTable"
import { Mob } from "../mob/model/mob"
import { getMobRepository } from "../mob/repository/mob"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import ExitRepository, { getExitRepository } from "../room/repository/exit"
import RoomRepository, { getRoomRepository } from "../room/repository/room"
import { default as RoomTable } from "../room/roomTable"

export default class Service {
  public static async new(
    mobService: MobService,
    roomTable: RoomTable = new RoomTable({}),
    itemTable: ItemTable = new ItemTable([]),
    exitTable: ExitTable = new ExitTable(mobService.locationService, []),
    time: number = 0,
  ): Promise<Service> {
    return new Service(
      mobService,
      roomTable, itemTable, exitTable,
      await getRoomRepository(),
      await getExitRepository(),
      time)
  }

  public static async newWithArray(rooms: Room[] = [], exits: Exit[] = []): Promise<Service> {
    const locationService = new LocationService([])
    const mobService = new MobService(
      new MobTable(),
      await getMobRepository(),
      new FightTable(),
      locationService)
    return Service.new(
      mobService,
      RoomTable.new(rooms),
      null,
      new ExitTable(locationService, exits))
  }

  /* tslint:disable */
  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemTable: ItemTable,
    public readonly exitTable: ExitTable,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository,
    private time = 0) {
  }

  public incrementTime() {
    this.time += 1
  }

  public getCurrentTime() {
    return this.time
  }

  public resetTime() {
    this.time = 0
  }

  public async saveRoom(room): Promise<any> {
    return this.roomRepository.save(room)
  }

  public async saveExit(exit): Promise<any> {
    return this.exitRepository.save(exit)
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

  public getNewActionDefinition(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this, requestType, action, precondition)
  }

  public getMobLocation(mob: Mob) {
    return this.mobService.locationService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.locationService.getMobsByRoom(room)
  }
}
