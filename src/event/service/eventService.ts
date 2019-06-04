import {injectable} from "inversify"
import "reflect-metadata"
import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import Event from "../event"
import EventConsumer from "../eventConsumer"
import EventResponse from "../eventResponse"

@injectable()
export default class EventService {
  private eventChannels: any = {}

  constructor() {
    this.initializeEventChannels()
  }

  public addConsumer(eventConsumer: EventConsumer) {
    eventConsumer.getConsumingEventTypes().forEach(eventType =>
      this.eventChannels[eventType].push(eventConsumer))
  }

  public async publish(event: Event): Promise<EventResponse> {
    let status = EventResponseStatus.Unhandled
    for (const eventConsumer of this.eventChannels[event.eventType]) {
      const eventResponse = await eventConsumer.consume(event)
      status = eventResponse.status
      if (eventResponse.isSatisfied()) {
        return eventResponse
      }
      if (eventResponse.isModified()) {
        event = eventResponse.event
      }
    }
    return new EventResponse(event, status)
  }

  private initializeEventChannels() {
    Object.values(EventType).forEach(eventType => this.eventChannels[eventType] = [])
  }
}
