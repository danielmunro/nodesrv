import { Exit } from "./model/exit"
import {Room} from "./model/room"

export default class ExitTable {
  constructor(
    private readonly exits: Exit[] = []) {}

  public exitsForRoom(room: Room): Exit[] {
    return this.exits.filter(exit => exit.source.id === room.id)
  }
}
