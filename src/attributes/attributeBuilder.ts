import {newHitroll, newStats, newVitals} from "./factory"
import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

export default class AttributeBuilder {
  private readonly attributes: Attributes

  constructor() {
    this.attributes = new Attributes()
    this.attributes.vitals = newVitals(0, 0, 0)
    this.attributes.stats = newStats(0, 0, 0, 0, 0, 0)
    this.attributes.hitroll = newHitroll(0, 0)
  }

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
