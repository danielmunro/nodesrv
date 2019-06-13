import DamageSourceEntity from "../entity/damageSourceEntity"

export default class DamageSourceBuilder {
  private readonly damageSource = new DamageSourceEntity()

  public enableMental(): DamageSourceBuilder {
    this.damageSource.mental = true
    return this
  }

  public get(): DamageSourceEntity {
    return this.damageSource
  }
}
