import Event from "../event"
import EventConsumer from "../eventConsumer"
import {EventResponse} from "../eventResponse"
import {EventType} from "../eventType"

export default class TestAConsumer implements EventConsumer {
  public getConsumingEventType(): EventType {
    return EventType.TestA
  }

  public consume(event: Event): EventResponse {
    return EventResponse.Satisfied
  }
}
