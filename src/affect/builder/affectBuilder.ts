import AttributesEntity from "../../attributes/entity/attributesEntity"
import DamageSourceEntity from "../../mob/entity/damageSourceEntity"
import {AffectEntity} from "../entity/affectEntity"
import {AffectType} from "../enum/affectType"

export default class AffectBuilder {
  private readonly affect = new AffectEntity()

  constructor(affectType: AffectType) {
    this.affect.affectType = affectType
    this.affect.timeout = -1
  }

  public setTimeout(timeout: number): AffectBuilder {
    this.affect.timeout = timeout
    return this
  }

  public setLevel(level: number): AffectBuilder {
    this.affect.level = level
    return this
  }

  public setAttributes(attributes: AttributesEntity): AffectBuilder {
    this.affect.attributes = attributes
    return this
  }

  public setResist(damageSource: DamageSourceEntity): AffectBuilder {
    this.affect.resist = damageSource
    return this
  }

  public setImmune(damageSource: DamageSourceEntity): AffectBuilder {
    this.affect.immune = damageSource
    return this
  }

  public setVulnerable(damageSource: DamageSourceEntity): AffectBuilder {
    this.affect.vulnerable = damageSource
    return this
  }

  public build(): AffectEntity {
    return this.affect
  }
}
