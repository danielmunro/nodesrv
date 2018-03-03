import { Modellable } from "./../db/model"
import { Mob } from "./../mob/mob"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/exit"
import { Room } from "./../room/room"

export class Player implements Modellable {
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

  public getRoom(): Room {
    return this.mob.getRoom()
  }

  public getExit(direction: Direction): Exit | null {
    return this.mob.getExit(direction)
  }

  public getMob(): Mob {
    return this.mob
  }

  public moveTo(room: Room): void {
    this.mob.moveTo(room)
  }

  public toString(): string {
    return this.getIdentifier()
  }

  public getModel(): object {
    return {
      identifier: this.identifier,
      name: this.name,
    }
  }
}
