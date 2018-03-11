import { Mob } from "./../mob/model/mob"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/model/exit"
import { Room } from "./../room/model/room"

export class Player {
  private readonly identifier: string
  private readonly name: string
  private mob: Mob

  constructor(identifier: string, name: string) {
    this.identifier = identifier
    this.name = name
  }

  public setMob(mob: Mob) {
    this.mob = mob
  }

  public getIdentifier(): string {
    return this.identifier
  }

  public getName(): string {
    return this.name
  }

  public getRoom(): Room {
    return this.mob.room
  }

  public getExit(direction: Direction): Exit | null {
    return this.mob.room.exits.find((exit) => exit.direction === direction.toString())
  }

  public getMob(): Mob {
    return this.mob
  }

  public moveTo(room: Room): void {
    this.mob.room = room
  }

  public toString(): string {
    return this.getIdentifier()
  }
}
