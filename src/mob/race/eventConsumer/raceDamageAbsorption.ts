import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import DamageEvent from "../../event/damageEvent"
import {DamageType} from "../../fight/enum/damageType"
import {RaceType} from "../enum/raceType"

export default abstract class RaceDamageAbsorption implements EventConsumer {
  protected race: RaceType
  protected damageType: DamageType
  protected modifier: number

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public consume(event: DamageEvent): Promise<EventResponse> {
    if (this.doesConsumerApply(event)) {
      return EventResponse.modified(createModifiedDamageEvent(event, this.modifier))
    }

    return EventResponse.none(event)
  }

  protected doesConsumerApply(event: DamageEvent): boolean {
    return event.mob.raceType === this.race && event.damageType === this.damageType
  }
}
