import { Attributes } from "./../attributes/attributes"
import { Vitals } from "./../attributes/vitals"
import { Modellable } from "./../db/model"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/exit"
import { Room } from "./../room/room"
import { Race } from "./race/race"

export class Mob implements Modellable {
  private readonly identifier: string
  private readonly name: string
  private readonly race: Race
  private level: number
  private trains: number
  private practices: number
  private attributes: Attributes
  // private vitals: Vitals
  private room: Room

  constructor(
    identifier: string,
    name: string,
    race: Race,
    level: number,
    trains: number,
    practices: number,
    startingAttributes: Attributes,
    room: Room,
  ) {
    this.identifier = identifier
    this.name = name
    this.race = race
    this.level = level
    this.trains = trains
    this.practices = practices
    this.attributes = startingAttributes
    // this.vitals = new Vitals(
    //   startingAttributes.vitals.hp,
    //   startingAttributes.vitals.mana,
    //   startingAttributes.vitals.mv)
    this.room = room
  }

  public getExit(direction: Direction): Exit | null {
    return this.room.getExit(direction)
  }

  public levelUp(): void {
    this.level++
    this.trains++
    this.practices += this.getAttributes().stats.wis / 5
    this.attributes = this.attributes.combine(Attributes.withVitals(new Vitals(1, 1, 1)))
  }

  public getAttributes(): Attributes {
    return this.attributes
  }

  public getName(): string {
    return this.name
  }

  public getRoom(): Room {
    return this.room
  }

  public getModel(): object {
    return {
      identifier: this.identifier,
      level: this.level,
      name: this.name,
      practices: this.practices,
      race: this.race,
      room: this.room.identifier,
      trains: this.trains,
      ...this.attributes.getModel(),
    }
  }

  public moveTo(room: Room) {
    this.room = room
  }
}
