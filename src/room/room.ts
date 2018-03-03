import { Modellable } from "./../db/model"
import { Mob } from "./../mob/mob"
import { Direction } from "./constants"
import { Exit } from "./exit"

export class Room implements Modellable {
  public readonly identifier: string
  public readonly name: string
  public readonly description: string
  public readonly exits: Exit[]
  private mobs: Mob[]

  constructor(identifier: string, name: string, description: string, exits: Exit[] = [], mobs: Mob[] = []) {
    this.identifier = identifier
    this.name = name
    this.description = description
    this.exits = exits
    this.mobs = mobs
    this.mobs.map((mob) => mob.moveTo(this))
  }

  public getExit(direction: Direction): Exit | null {
    return this.exits.find((exit) => exit.direction === direction)
  }

  public addMob(mob: Mob) {
    this.mobs.push(mob)
    if (mob.getRoom() !== this) {
      mob.moveTo(this)
    }
  }

  public removeMob(mob: Mob) {
    this.mobs = this.mobs.filter((m) => m !== mob)
  }

  public getMobs(): Mob[] {
    return this.mobs
  }

  public getModel(): object {
    return {
      description: this.description,
      identifier: this.identifier,
      name: this.name,
      ...this.flattenExits(),
    }
  }

  private flattenExits() {
    const exits = {}
    this.exits.map((e) => exits[e.direction] = e.roomID)

    return exits
  }
}
