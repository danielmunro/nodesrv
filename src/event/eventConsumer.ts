import Event from "./event"
import {EventResponseStatus} from "./eventResponseStatus"
import {EventType} from "./eventType"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  consume(event: Event): Promise<EventResponseStatus>
}
