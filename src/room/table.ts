import { Room } from "./model/room"
import { getRoomRepository } from "./repository/room"

export default class Table {
  public static new(rooms: Room[]) {
    const roomsById = {}
    rooms.forEach((room) => roomsById[room.uuid] = room)
    return new Table(roomsById)
  }

  constructor(
    public readonly roomsById: object,
  ) {}
}

export async function newTable(): Promise<Table> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.find({ relations: ["mobs"] })
  console.debug(`room table initialized with ${models.length} rooms`)
  return Table.new(models)
}
