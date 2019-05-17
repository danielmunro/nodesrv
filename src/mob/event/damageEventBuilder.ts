import {DamageType} from "../fight/damageType"
import {Mob} from "../model/mob"
import DamageEvent from "./damageEvent"

export default class DamageEventBuilder {
  private modifier: number = 1
  private source: Mob

  constructor(
    private readonly target: Mob,
    private readonly amount: number,
    private readonly damageType: DamageType) {}

  public setSource(source: Mob): DamageEventBuilder {
    this.source = source
    return this
  }

  public build(): DamageEvent {
    return new DamageEvent(
      this.target,
      this.amount,
      this.damageType,
      this.modifier,
      this.source)
  }
}
