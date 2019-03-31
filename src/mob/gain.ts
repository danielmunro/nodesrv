import AttributeBuilder from "../attributes/attributeBuilder"
import {newVitals} from "../attributes/factory"
import Attributes from "../attributes/model/attributes"

export default class Gain {
  constructor(
    public readonly newLevel: number,
    public readonly hp: number,
    public readonly mana: number,
    public readonly mv: number,
    public readonly practices: number) {}

  public createAttributes(): Attributes {
    return new AttributeBuilder()
      .setVitals(newVitals(this.hp, this.mana, this.mv)).build()
  }
}
