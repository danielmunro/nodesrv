import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import Event from "../interface/event"
import EventConsumer from "../interface/eventConsumer"
import EventResponse from "../messageExchange/eventResponse"

export default class TestBConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestB]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return new EventResponse(event, EventResponseStatus.None)
  }
}
