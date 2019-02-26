import { Room } from "../room/model/room"

export default class RoomBuilder {
  constructor(public readonly room: Room) {}

  public setArea(area: string): RoomBuilder {
    this.room.area = area
    return this
  }
}
