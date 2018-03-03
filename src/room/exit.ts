import { Direction } from "./constants"

export class Exit {
  public readonly roomID: string
  public readonly direction: Direction

  constructor(roomID: string, direction: Direction) {
    this.roomID = roomID
    this.direction = direction
  }
}
