import { Attribute, Attributes } from "./../attributes/attributes"
import { Vitals } from "./../attributes/vitals"
import { Modellable } from "./../db/model"
import { Race } from "./race/race"

export class Mob implements Modellable {
  private name: string
  private race: Race
  private level: number
  private trains: number
  private practices: number
  private attributes: Attributes
  private vitals: Vitals

  constructor(name: string, race: Race, level: number, startingAttributes: Attributes) {
    this.name = name
    this.race = race
    this.level = level
    this.attributes = startingAttributes
    this.vitals = new Vitals(
      startingAttributes.vitals.hp,
      startingAttributes.vitals.mana,
      startingAttributes.vitals.mv)
  }

  public hydrate(data) {
    this.name = data.name
    this.race = data.race
    this.level = data.level
    this.attributes = this.attributes.hydrate(data)
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

  public getModel(): object {
    return {
      level: this.level,
      name: this.name,
      race: this.race,
      ...this.attributes.getModel(),
    }
  }
}
