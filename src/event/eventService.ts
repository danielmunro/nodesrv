import Event from "./event"
import EventConsumer from "./eventConsumer"
import EventResponse from "./eventResponse"
import {EventResponseStatus} from "./eventResponseStatus"

export default class EventService {
  constructor(private readonly eventConsumers: EventConsumer[] = []) {}

  public addConsumer(eventConsumer: EventConsumer) {
    this.eventConsumers.push(eventConsumer)
  }

  public async publish(event: Event): Promise<EventResponse> {
    let status = EventResponseStatus.Unhandled
    for (const eventConsumer of this.eventConsumers) {
      if (eventConsumer.getConsumingEventTypes().includes(event.getEventType())) {
        const eventResponse = await eventConsumer.consume(event)
        status = eventResponse.status
        if (eventResponse.isSatisifed()) {
          return eventResponse
        }
        if (eventResponse.isModified()) {
          event = eventResponse.event
        }
      }
    }
    return new EventResponse(event, status)
  }
}
