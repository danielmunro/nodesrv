import Event from "../event"
import EventConsumer from "../eventConsumer"
import EventResponse from "../eventResponse"
import {EventResponseStatus} from "../eventResponseStatus"
import {EventType} from "../eventType"

export default class TestBConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestB]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return new EventResponse(event, EventResponseStatus.None)
  }
}
