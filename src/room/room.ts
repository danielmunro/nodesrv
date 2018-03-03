import { Modellable } from "./../db/model"
import { Direction } from "./constants"
import { Exit } from "./exit"

export class Room implements Modellable {
  public readonly identifier: string
  public readonly name: string
  public readonly description: string
  public readonly exits: Exit[]

  constructor(identifier: string, name: string, description: string, exits: Exit[]) {
    this.identifier = identifier
    this.name = name
    this.description = description
    this.exits = exits
  }

  public getExit(direction: Direction): Exit | null {
    return this.exits.find((exit) => exit.direction === direction)
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
