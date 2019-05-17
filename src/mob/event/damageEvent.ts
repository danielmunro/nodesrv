import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {DamageType} from "../fight/damageType"
import {Mob} from "../model/mob"

export default class DamageEvent implements Event {
  constructor(
    public readonly target: Mob,
    public readonly amount: number,
    public readonly damageType: DamageType,
    public readonly modifier: number,
    public readonly source: Mob) {}

  public getEventType(): EventType {
    return EventType.DamageCalculation
  }

  public createNewDamageEventAddingToModifier(modifier: number) {
    return new DamageEvent(
      this.target,
      this.amount,
      this.damageType,
      this.modifier + modifier,
      this.source)
  }

  public createNewDamageEventReplacingModifier(modifier: number) {
    return new DamageEvent(
      this.target,
      this.amount,
      this.damageType,
      modifier,
      this.source)
  }

  public calculateAmount(): number {
    if (this.modifier < 0) {
      return 0
    }

    return this.amount * this.modifier
  }
}
