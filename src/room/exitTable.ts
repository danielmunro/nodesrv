import { Mob } from "../mob/model/mob"
import { Exit } from "./model/exit"

export default class ExitTable {
  constructor(private readonly exits: Exit[]) {}

  public exitsForMob(mob: Mob): Exit[] {
    return this.exits.filter(exit => exit.source.id === mob.room.id)
  }
}
