import {injectable} from "inversify"
import "reflect-metadata"
import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import Event from "../interface/event"
import EventChannels from "../interface/eventChannels"
import EventConsumer from "../interface/eventConsumer"
import EventResponse from "../messageExchange/eventResponse"

@injectable()
export default class EventService {
  private eventChannels: EventChannels = {}

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
      if (!await eventConsumer.isEventConsumable(event)) {
        continue
      }
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
