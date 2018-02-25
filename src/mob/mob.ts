import { AttributesHydrator } from "./../attributes/attributeHydrator"
import { Attribute, Attributes } from "./../attributes/attributes"
import { Vitals } from "./../attributes/vitals"
import { ModelHydrator, Modellable } from "./../db/model"
import { Race } from "./race/race"

export class Mob implements Modellable {
  private readonly name: string
  private readonly race: Race
  private level: number
  private trains: number
  private practices: number
  private attributes: Attributes
  private vitals: Vitals

  constructor(
    name: string,
    race: Race,
    level: number,
    trains: number,
    practices: number,
    startingAttributes: Attributes,
  ) {
    this.name = name
    this.race = race
    this.level = level
    this.trains = trains
    this.practices = practices
    this.attributes = startingAttributes
    this.vitals = new Vitals(
      startingAttributes.vitals.hp,
      startingAttributes.vitals.mana,
      startingAttributes.vitals.mv)
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

  public getModel(): object {
    return {
      level: this.level,
      name: this.name,
      practices: this.practices,
      race: this.race,
      trains: this.trains,
      ...this.attributes.getModel(),
    }
  }
}
