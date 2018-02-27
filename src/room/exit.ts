import { Direction } from "./constants"
import { Room } from "./room"

export class Exit {
  public readonly roomID: string
  public readonly direction: Direction

  constructor(roomID: string, direction: Direction) {
    this.roomID = roomID
    this.direction = direction
  }
}
