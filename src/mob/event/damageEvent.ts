import {DamageType} from "../../damage/damageType"
import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Mob} from "../model/mob"

export default class DamageEvent implements Event {
  constructor(
    public readonly target: Mob,
    public readonly amount: number,
    public readonly damageType: DamageType,
    public readonly source?: Mob) {}

  public getEventType(): EventType {
    return EventType.DamageCalculation
  }
}
