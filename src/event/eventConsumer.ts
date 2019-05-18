import {EventType} from "./enum/eventType"
import Event from "./event"
import EventResponse from "./eventResponse"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  consume(event: Event): Promise<EventResponse>
}
