import Attributes from "../model/attributes"

export default class AttributeBuilder {
  private readonly attributes: Attributes

  constructor() {
    this.attributes = new Attributes()
    this.attributes.hp = 0
    this.attributes.mana = 0
    this.attributes.mv = 0
    this.attributes.str = 0
    this.attributes.int = 0
    this.attributes.wis = 0
    this.attributes.dex = 0
    this.attributes.con = 0
    this.attributes.sta = 0
    this.attributes.hit = 0
    this.attributes.dam = 0
  }

  public setHitRoll(hit: number, dam: number): AttributeBuilder {
    this.attributes.hit = hit
    this.attributes.dam = dam
    return this
  }

  public setStats(str: number, int: number, wis: number, dex: number, con: number, sta: number): AttributeBuilder {
    this.attributes.str = str
    this.attributes.int = int
    this.attributes.wis = wis
    this.attributes.dex = dex
    this.attributes.con = con
    this.attributes.sta = sta
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
