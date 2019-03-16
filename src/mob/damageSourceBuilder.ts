import DamageSource from "./model/damageSource"

export default class DamageSourceBuilder {
  private readonly damageSource = new DamageSource()

  public enableMental(): DamageSourceBuilder {
    this.damageSource.mental = true
    return this
  }

  public get(): DamageSource {
    return this.damageSource
  }
}
