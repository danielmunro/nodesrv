import { Direction } from "./constants"
import { Room } from "./room"

export class Exit {
  public readonly roomName: string
  public readonly direction: Direction

  constructor(roomName: string, direction: Direction) {
    this.roomName = roomName
    this.direction = direction
  }
}
