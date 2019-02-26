import {Direction} from "../room/constants"
import Door from "../room/model/door"
import { Room } from "../room/model/room"

export default class RoomBuilder {
  constructor(public readonly room: Room) {}

  public setArea(area: string): RoomBuilder {
    this.room.area = area
    return this
  }

  public addDoor(door: Door, direction: Direction): RoomBuilder {
    const exit = this.room.exits.find(e => e.direction === direction)
    if (!exit) {
      throw new Error("cannot attach door to nonexistent exit")
    }
    exit.door = door
    return this
  }
}
