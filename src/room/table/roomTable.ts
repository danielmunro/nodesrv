import { RoomEntity } from "../entity/roomEntity"
import RoomsById from "../interface/roomsById"

export default class RoomTable {
  public static new(rooms: RoomEntity[]) {
    const roomsById: RoomsById = {}
    rooms.forEach(room => roomsById[room.uuid] = room)
    return new RoomTable(roomsById)
  }

  constructor(private readonly roomsById: RoomsById = {}) {}

  public getRooms(): RoomEntity[] {
    return Object.values(this.roomsById)
  }

  public get(uuid: string): RoomEntity {
    return this.roomsById[uuid]
  }

  public add(room: RoomEntity) {
    this.roomsById[room.uuid] = room
  }

  public count() {
    return Object.keys(this.roomsById).length
  }
}
