import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"

export default class AttributeBuilder {
  private readonly attributes: Attributes = new Attributes()

  public setHitRoll(hitRoll: Hitroll): AttributeBuilder {
    this.attributes.hitroll = hitRoll
    return this
  }

  public build(): Attributes {
    return this.attributes
  }
}
