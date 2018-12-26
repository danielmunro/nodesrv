import Event from "../event"
import EventConsumer from "../eventConsumer"
import {EventResponse} from "../eventResponse"
import {EventType} from "../eventType"

export default class TestBConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestB]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return EventResponse.None
  }
}
