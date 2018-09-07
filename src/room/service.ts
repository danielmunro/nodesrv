import { Definition } from "../action/definition/definition"
import { Mob } from "../mob/model/mob"
import { default as MobTable } from "../mob/table"
import { RequestType } from "../request/requestType"
import { Direction } from "./constants"
import { Exit } from "./model/exit"
import { Room } from "./model/room"
import ExitRepository, { getExitRepository } from "./repository/exit"
import RoomRepository, { getRoomRepository } from "./repository/room"
import { default as RoomTable } from "./table"

export default class Service {
  public static async new(table: RoomTable = new RoomTable({}), mobTable: MobTable = new MobTable()): Promise<Service> {
    return new Service(table, mobTable, await getRoomRepository(), await getExitRepository())
  }

  public static async newWithArray(rooms: Room[]): Promise<Service> {
    return Service.new(RoomTable.new(rooms))
  }

  constructor(
    public readonly roomTable: RoomTable,
    public readonly mobTable: MobTable,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository) {}

  public async saveRoom(room): Promise<any> {
    return this.roomRepository.save(room)
  }

  public async saveExit(exit): Promise<any> {
    return this.exitRepository.save(exit)
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const roomExit = this.roomTable.exitsForMob(mob).find((e) => e.direction === direction)

    if (!roomExit) {
      throw new Error("cannot move in that direction")
    }

    const exit = await this.findRoomExitWithDestination(roomExit.id)
    this.roomTable.canonical(exit.destination).addMob(mob)
  }

  public getNewDefinition(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this, requestType, action, precondition)
  }

  private async findRoomExitWithDestination(id: number): Promise<Exit> {
    return this.exitRepository.findOneById(id)
  }
}
