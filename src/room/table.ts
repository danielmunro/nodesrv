import { Room } from "./model/room"

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
    return this.get(room.uuid)
  }
}
