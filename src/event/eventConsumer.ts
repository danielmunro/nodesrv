import Event from "./event"
import {EventType} from "./eventType"
import EventResponse from "./eventResponse"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  consume(event: Event): Promise<EventResponse>
}
