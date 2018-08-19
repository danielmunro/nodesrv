import { Repository } from "typeorm"
import { Mob } from "../mob/model/mob"
import { Direction } from "./constants"
import { Exit } from "./model/exit"
import { Room } from "./model/room"
import { getExitRepository } from "./repository/exit"
import { getRoomRepository } from "./repository/room"
import { getRoom } from "./table"

export default class Service {
  public static async new(): Promise<Service> {
    return new Service(await getRoomRepository(), await getExitRepository())
  }

  constructor(
    private readonly roomRepository: Repository<Room>,
    private readonly exitRepository: Repository<Exit>) {}

  public async saveRoom(room): Promise<any> {
    return this.roomRepository.save(room)
  }

  public async saveExit(exit): Promise<any> {
    return this.exitRepository.save(exit)
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const roomExit = getRoom(mob.room.uuid).exits.find((e) => e.direction === direction)

    if (!roomExit) {
      throw new Error("cannot move in that direction")
    }

    const exit = await this.findRoomExitWithDestination(roomExit.id)
    getRoom(exit.destination.uuid).addMob(mob)
  }

  private async findRoomExitWithDestination(id: number): Promise<Exit> {
    return this.exitRepository.findOneById(id, { relations: ["destination"] })
  }
}
