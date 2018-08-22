import { Mob } from "../mob/model/mob"
import { Exit } from "./model/exit"
import { Room } from "./model/room"
import { getRoomRepository } from "./repository/room"

export default class Table {
  public static new(rooms: Room[]) {
    const roomsById = {}
    rooms.forEach((room) => roomsById[room.uuid] = room)
    return new Table(roomsById)
  }

  constructor(private readonly roomsById: object) {}

  public get(uuid: string): Room {
    return this.roomsById[uuid]
  }

  public canonical(room: Room): Room {
    return this.roomsById[room.uuid]
  }

  public exitsForMob(mob: Mob): Exit[] {
    return this.canonical(mob.room).exits
  }
}

export async function newTable(): Promise<Table> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.find({ relations: ["mobs"] })
  console.debug(`room table initialized with ${models.length} rooms`)
  return Table.new(models)
}
