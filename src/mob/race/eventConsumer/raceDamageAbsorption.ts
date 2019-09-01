import { injectable } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import DamageEvent from "../../event/damageEvent"
import {DamageType} from "../../fight/enum/damageType"
import {RaceType} from "../enum/raceType"

@injectable()
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
