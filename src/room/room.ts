import { Direction } from "./constants"
import { Exit } from "./exit"

export class Room {
  public readonly name: string
  public readonly brief: string
  public readonly description: string
  public readonly exits: Exit[]

  constructor(name: string, brief: string, description: string, exits: Exit[]) {
    this.name = name
    this.brief = brief
    this.description = description
    this.exits = exits
  }

  public getModel(): object {
    return {
      brief: this.brief,
      description: this.description,
      name: this.name,
      ...this.flattenExits(),
    }
  }

  private flattenExits() {
    const exits = {}
    this.exits.map((e) => exits[e.direction] = e.roomName)

    return exits
  }
}
