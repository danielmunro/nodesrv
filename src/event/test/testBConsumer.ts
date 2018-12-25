import Event from "../event"
import EventConsumer from "../eventConsumer"
import {EventResponse} from "../eventResponse"
import {EventType} from "../eventType"

export default class TestBConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestB]
  }

  public consume(event: Event): EventResponse {
    return EventResponse.None
  }
}
