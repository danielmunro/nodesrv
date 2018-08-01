import { Room } from "./model/room"
import { getRoomRepository } from "./repository/room"

let allRooms = []
let roomsById = {}

export async function initialize() {
  reset()
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.find({ relations: ["mobs"] })
  const tmpAllRooms = []
  const tmpRoomsById = {}
  models.forEach((model) => {
    tmpRoomsById[model.uuid] = model
    tmpAllRooms.push(model)
  })
  allRooms = tmpAllRooms
  roomsById = tmpRoomsById
  console.debug(`room table initialized with ${models.length} rooms`)
}

export function reset() {
  allRooms = []
  roomsById = {}
}

export function addRoom(room: Room) {
  allRooms.push(room)
  roomsById[room.uuid] = room
}

export function getRoom(uuid: string) {
  return roomsById[uuid]
}
