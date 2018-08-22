import { Mob } from "../mob/model/mob"
import { Direction } from "./constants"
import { Exit } from "./model/exit"
import { Room } from "./model/room"
import ExitRepository, { getExitRepository } from "./repository/exit"
import RoomRepository, { getRoomRepository } from "./repository/room"
import Table from "./table"

export default class Service {
  public static async new(table: Table = new Table({})): Promise<Service> {
    return new Service(table, await getRoomRepository(), await getExitRepository())
  }

  public static async newWithArray(rooms: Room[]): Promise<Service> {
    return Service.new(Table.new(rooms))
  }

  constructor(
    public readonly table: Table,
    private readonly roomRepository: RoomRepository,
    private readonly exitRepository: ExitRepository) {}

  public async saveRoom(room): Promise<any> {
    return this.roomRepository.save(room)
  }

  public async saveExit(exit): Promise<any> {
    return this.exitRepository.save(exit)
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const roomExit = this.table.exitsForMob(mob).find((e) => e.direction === direction)

    if (!roomExit) {
      throw new Error("cannot move in that direction")
    }

    const exit = await this.findRoomExitWithDestination(roomExit.id)
    this.table.canonical(exit.destination).addMob(mob)
  }

  private async findRoomExitWithDestination(id: number): Promise<Exit> {
    return this.exitRepository.findOneById(id)
  }
}
