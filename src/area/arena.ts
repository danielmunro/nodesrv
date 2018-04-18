import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"

export class Arena {
  private rooms: Room[] = []
  private exits: Exit[] = []

  public addRoom(room) {
    this.rooms.push(room)
  }

  public addExit(exit) {
    this.exits.push(exit)
  }

  public getRooms(): Room[] {
    return this.rooms
  }

  public getExits(): Exit[] {
    return this.exits
  }
}
