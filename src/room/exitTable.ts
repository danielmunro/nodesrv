import { Exit } from "./model/exit"
import {Room} from "./model/room"

export default class ExitTable {
  constructor(
    private readonly exits: Exit[] = []) {}

  public exitsForRoom(room: Room): Exit[] {
    return this.exits.filter(exit => exit.source.uuid === room.uuid)
  }

  public add(exit: Exit) {
    this.exits.push(exit)
  }
}
