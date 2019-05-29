import {newStats} from "../factory/attributeFactory"
import Attributes from "../model/attributes"
import Stats from "../model/stats"

export default class AttributeBuilder {
  private readonly attributes: Attributes

  constructor() {
    this.attributes = new Attributes()
    this.attributes.hp = 0
    this.attributes.mana = 0
    this.attributes.mv = 0
    this.attributes.stats = newStats(0, 0, 0, 0, 0, 0)
    this.attributes.hit = 0
    this.attributes.dam = 0
  }

  public setHitRoll(hit: number, dam: number): AttributeBuilder {
    this.attributes.hit = hit
    this.attributes.dam = dam
    return this
  }

  public setStats(stats: Stats): AttributeBuilder {
    this.attributes.stats = stats
    return this
  }

  public setVitals(hp: number, mana: number, mv: number): AttributeBuilder {
    this.attributes.hp = hp
    this.attributes.mana = mana
    this.attributes.mv = mv
    return this
  }

  public build(): Attributes {
    return this.attributes
  }
}
