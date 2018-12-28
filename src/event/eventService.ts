import Event from "./event"
import EventConsumer from "./eventConsumer"
import {EventResponse} from "./eventResponse"

export default class EventService {
  constructor(private readonly eventConsumers: EventConsumer[] = []) {}

  public addConsumer(eventConsumer: EventConsumer) {
    this.eventConsumers.push(eventConsumer)
  }

  public async publish(event: Event): Promise<EventResponse> {
    let response = EventResponse.Unhandled
    for (const eventConsumer of this.eventConsumers) {
      if (eventConsumer.getConsumingEventTypes().includes(event.getEventType())) {
        response = await eventConsumer.consume(event)
        if (response === EventResponse.Satisfied) {
          return response
        }
      }
    }
    return response
  }
}
