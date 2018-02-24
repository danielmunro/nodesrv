import { v4 } from "uuid"
import { Attributes } from "./../attributes/attributes"
import { HitDam } from "./../attributes/hitdam"
import { Stats } from "./../attributes/stats"
import { Vitals } from "./../attributes/vitals"
import { Client } from "./../client/client"
import { Modellable } from "./../db/model"
import { Mob } from "./../mob/mob"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/exit"
import { Room } from "./../room/room"

export class Player implements Modellable {
  private readonly id: string
  private readonly name: string
  private room: Room
  private mob: Mob

  constructor(name: string, room: Room) {
    this.id = v4()
    this.name = name
    this.room = room
  }

  public getId(): string {
    return this.id
  }

  public getRoomName(): string {
    return this.room.name
  }

  public getExit(direction: Direction): Exit | null {
    return this.room.getExit(direction)
  }

  public getRoomModel() {
    return this.room.getModel()
  }

  public moveTo(room: Room) {
    this.room = room
  }

  public toString(): string {
    return this.getId()
  }

  public getModel(): object {
    return {
      ...this.mob.getModel(),
      id: this.id,
      name: this.name,
      room: this.room.name,
    }
  }

  public hydrate(data) {

  }
}
