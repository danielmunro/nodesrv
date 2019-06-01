import { Exit } from "../model/exit"
import {Room} from "../model/room"

export default class ExitTable {
  constructor(
    private readonly exits: Exit[] = []) {}

  public exitsForRoom(room: Room): Exit[] {
    const roomExitIds = room.exits.map(exit => exit.id)
    return this.exits.filter(exit => roomExitIds.includes(exit.id))
  }

  public add(exit: Exit) {
    this.exits.push(exit)
  }
}
