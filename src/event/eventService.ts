import {injectable} from "inversify"
import "reflect-metadata"
import {EventResponseStatus} from "./enum/eventResponseStatus"
import Event from "./event"
import EventConsumer from "./eventConsumer"
import EventResponse from "./eventResponse"

@injectable()
export default class EventService {
  constructor(private readonly eventConsumers: EventConsumer[] = []) {}

  public addConsumer(eventConsumer: EventConsumer) {
    this.eventConsumers.push(eventConsumer)
  }

  public async publish(event: Event): Promise<EventResponse> {
    let status = EventResponseStatus.Unhandled
    for (const eventConsumer of this.eventConsumers) {
      if (eventConsumer.getConsumingEventTypes().includes(event.eventType)) {
        const eventResponse = await eventConsumer.consume(event)
        status = eventResponse.status
        if (eventResponse.isSatisfied()) {
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
