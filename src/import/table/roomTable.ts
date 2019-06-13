import { RoomEntity } from "../../room/entity/roomEntity"

export default class RoomTable {
  private readonly roomsByImportId = {}

  constructor(rooms: RoomEntity[]) {
    for (const room of rooms) {
      this.roomsByImportId[room.canonicalId] = room
    }
  }

  public getByImportId(id): RoomEntity {
    return this.roomsByImportId[id]
  }
}
