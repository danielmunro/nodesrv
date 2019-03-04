import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

export default class AttributeBuilder {
  private readonly attributes: Attributes = new Attributes()

  public setHitRoll(hitRoll: Hitroll): AttributeBuilder {
    this.attributes.hitroll = hitRoll
    return this
  }

  public setStats(stats: Stats): AttributeBuilder {
    this.attributes.stats = stats
    return this
  }

  public setVitals(vitals: Vitals): AttributeBuilder {
    this.attributes.vitals = vitals
    return this
  }

  public build(): Attributes {
    return this.attributes
  }
}
