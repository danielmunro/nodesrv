import {EventType} from "../enum/eventType"
import EventResponse from "../messageExchange/eventResponse"
import Event from "./event"

export default interface EventConsumer {
  getConsumingEventTypes(): EventType[]
  isEventConsumable(event: Event): Promise<boolean>
  consume(event: Event): Promise<EventResponse>
}
