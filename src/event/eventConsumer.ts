import Event from "./event"
import {EventResponse} from "./eventResponse"
import {EventType} from "./eventType"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  consume(event: Event): Promise<EventResponse>
}
