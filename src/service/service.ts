import { Definition } from "../action/definition/definition"
import ItemTable from "../item/itemTable"
import { Mob } from "../mob/model/mob"
import { default as MobTable } from "../mob/table"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import ExitRepository, { getExitRepository } from "../room/repository/exit"
import RoomRepository, { getRoomRepository } from "../room/repository/room"
import { default as RoomTable } from "../room/table"

export default class Service {
  public static async new(
    roomTable: RoomTable = new RoomTable({}),
    mobTable: MobTable = new MobTable(),
    itemTable: ItemTable = new ItemTable([]),
    exitTable: ExitTable = new ExitTable([]),
  ): Promise<Service> {
    return new Service(
      roomTable, mobTable, itemTable, exitTable,
      await getRoomRepository(),
      await getExitRepository())
  }

  public static async newWithArray(rooms: Room[], exits: Exit[] = []): Promise<Service> {
    return Service.new(RoomTable.new(rooms), null, null, new ExitTable(exits))
  }

  constructor(
    public readonly roomTable: RoomTable,
    public readonly mobTable: MobTable,
    public readonly itemTable: ItemTable,
    public readonly exitTable: ExitTable,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository) {}

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

    this.roomTable.canonical(exit.destination).addMob(mob)
  }

  public getNewDefinition(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this, requestType, action, precondition)
  }
}
