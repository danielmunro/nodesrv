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
    let response = EventResponseStatus.Unhandled
    for (const eventConsumer of this.eventConsumers) {
      if (eventConsumer.getConsumingEventTypes().includes(event.getEventType())) {
        response = await eventConsumer.consume(event)
        if (response === EventResponseStatus.Satisfied) {
          return new EventResponse(event, response)
        }
      }
    }
    return new EventResponse(event, response)
  }
}
