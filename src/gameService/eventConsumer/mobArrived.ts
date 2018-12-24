import Event from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"

/**
 * Example -- use for mob traits, others
 */
export default class MobArrived implements EventConsumer {
  public getConsumingEventType(): EventType {
    return EventType.MobArrived
  }

  public consume(event: Event): EventResponse {
    return EventResponse.None
  }
}
