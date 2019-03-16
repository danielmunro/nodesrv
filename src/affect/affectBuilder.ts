import Attributes from "../attributes/model/attributes"
import DamageSource from "../mob/model/damageSource"
import {AffectType} from "./affectType"
import {Affect} from "./model/affect"

export default class AffectBuilder {
  private readonly affect = new Affect()

  constructor(affectType: AffectType) {
    this.affect.affectType = affectType
  }

  public setTimeout(timeout: number): AffectBuilder {
    this.affect.timeout = timeout
    return this
  }

  public setLevel(level: number): AffectBuilder {
    this.affect.level = level
    return this
  }

  public setAttributes(attributes: Attributes): AffectBuilder {
    this.affect.attributes = attributes
    return this
  }

  public setResist(damageSource: DamageSource): AffectBuilder {
    this.affect.resist = damageSource
    return this
  }

  public setImmune(damageSource: DamageSource): AffectBuilder {
    this.affect.immune = damageSource
    return this
  }

  public setVulnerable(damageSource: DamageSource): AffectBuilder {
    this.affect.vulnerable = damageSource
    return this
  }

  public build(): Affect {
    return this.affect
  }
}
