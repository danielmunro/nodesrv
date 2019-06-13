import { ExitEntity } from "../entity/exitEntity"
import {RoomEntity} from "../entity/roomEntity"

export default class ExitTable {
  constructor(
    private readonly exits: ExitEntity[] = []) {}

  public exitsForRoom(room: RoomEntity): ExitEntity[] {
    const roomExitIds = room.exits.map(exit => exit.id)
    return this.exits.filter(exit => roomExitIds.includes(exit.id))
  }

  public add(exit: ExitEntity) {
    this.exits.push(exit)
  }
}
