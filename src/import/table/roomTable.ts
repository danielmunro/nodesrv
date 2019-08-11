import { RoomEntity } from "../../room/entity/roomEntity"

export default class RoomTable {
  private readonly roomsByImportId = {}

  constructor(rooms: RoomEntity[]) {
    for (const room of rooms) {
      // @ts-ignore
      this.roomsByImportId[room.canonicalId] = room
    }
  }

  public getByImportId(id: any): RoomEntity {
    // @ts-ignore
    return this.roomsByImportId[id]
  }
}
