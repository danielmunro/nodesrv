import { Room } from "./model/room"
import { getRoomRepository } from "./repository/room"

export default class Table {
  constructor(
    public readonly allRooms: Room[],
    public readonly roomsById: object,
  ) {}
}

const allRooms = []
const roomsById = {}

export async function newTable(): Promise<Table> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.find({ relations: ["mobs"] })
  const tmpAllRooms = []
  const tmpRoomsById = {}
  models.forEach((model) => {
    tmpRoomsById[model.uuid] = model
    tmpAllRooms.push(model)
  })
  console.debug(`room table initialized with ${models.length} rooms`)
  return new Table(tmpAllRooms, tmpRoomsById)
}

export function addRoom(room: Room) {
  allRooms.push(room)
  roomsById[room.uuid] = room
}

export function getRoom(uuid: string): Room {
  return roomsById[uuid]
}
