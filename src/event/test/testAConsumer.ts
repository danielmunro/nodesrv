import Event from "../event"
import EventConsumer from "../eventConsumer"
import EventResponse from "../eventResponse"
import {EventResponseStatus} from "../eventResponseStatus"
import {EventType} from "../eventType"

export default class TestAConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestA]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return new EventResponse(event, EventResponseStatus.Satisfied)
  }
}
