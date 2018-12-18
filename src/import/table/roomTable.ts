import { Room } from "../../room/model/room"

export default class RoomTable {
  private readonly roomsByImportId = {}

  constructor(rooms: Room[]) {
    for (const room of rooms) {
      this.roomsByImportId[room.canonicalId] = room
    }
  }

  public getByImportId(id): Room {
    return this.roomsByImportId[id]
  }
}
