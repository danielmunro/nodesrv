import {Direction} from "../room/constants"
import Door from "../room/model/door"
import {Exit} from "../room/model/exit"
import { Room } from "../room/model/room"

export default class RoomBuilder {
  constructor(public readonly room: Room) {}

  public setArea(area: string): RoomBuilder {
    this.room.area = area
    return this
  }

  public addDoor(door: Door, direction: Direction): RoomBuilder {
    const exit = this.room.exits.find(e => e.direction === direction) as Exit
    exit.door = door
    return this
  }
}
