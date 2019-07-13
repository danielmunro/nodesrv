import {EventType} from "../enum/eventType"
import EventResponse from "../messageExchange/eventResponse"
import Event from "./event"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  consume(event: Event): Promise<EventResponse>
}
