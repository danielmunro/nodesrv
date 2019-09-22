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

  public async isEventConsumable(event: DamageEvent): Promise<boolean> {
    return this.doesConsumerApply(event)
  }

  public consume(event: DamageEvent): Promise<EventResponse> {
    return EventResponse.modified(createModifiedDamageEvent(event, this.modifier))
  }

  protected doesConsumerApply(event: DamageEvent): boolean {
    return event.mob.raceType === this.race && event.damageType === this.damageType
  }
}
