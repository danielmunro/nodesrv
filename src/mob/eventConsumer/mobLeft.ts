import Event from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"

export default class MobLeft implements EventConsumer {
  public getConsumingEventType(): EventType {
    return EventType.MobLeft
  }

  public consume(event: Event): EventResponse {
    return EventResponse.None
  }
}
