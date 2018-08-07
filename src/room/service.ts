import { Repository } from "typeorm"
import { Mob } from "../mob/model/mob"
import { Direction } from "./constants"
import { Exit } from "./model/exit"
import { Room } from "./model/room"
import { findOneExit, getExitRepository } from "./repository/exit"
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
}

export async function persistAll(rooms, exits): Promise<Room[]> {
  const roomRepository = await getRoomRepository()
  await roomRepository.save(rooms)
  const exitRepository = await getExitRepository()
  await exitRepository.save(exits)

  return Promise.resolve(rooms)
}

export function persistExit(exit): Promise<Exit> {
  return getExitRepository().then((exitRepository) => exitRepository.save(exit))
}

export function persistRoom(room): Promise<Room> {
  return getRoomRepository().then((roomRepository) => roomRepository.save(room))
}

export async function moveMob(mob: Mob, direction: Direction) {
  const room = getRoom(mob.room.uuid)
  const roomExit = room.exits.find((e) => e.direction === direction)

  if (!roomExit) {
    throw new Error("cannot move in that direction")
  }

  const exit = await findOneExit(roomExit.id)
  const destination = getRoom(exit.destination.uuid)
  destination.addMob(mob)
}
