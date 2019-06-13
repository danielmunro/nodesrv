import {createDamageEvent} from "../../event/factory/eventFactory"
import {MobEntity} from "../entity/mobEntity"
import {DamageType} from "../fight/enum/damageType"
import DamageEvent from "./damageEvent"

export default class DamageEventBuilder {
  private modifier: number = 1
  private source: MobEntity

  constructor(
    private readonly target: MobEntity,
    private readonly amount: number,
    private readonly damageType: DamageType) {}

  public setSource(source: MobEntity): DamageEventBuilder {
    this.source = source
    return this
  }

  public build(): DamageEvent {
    return createDamageEvent(
      this.target,
      this.amount,
      this.damageType,
      this.modifier,
      this.source)
  }
}
