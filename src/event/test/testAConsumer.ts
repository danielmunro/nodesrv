import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import Event from "../event"
import EventConsumer from "../eventConsumer"
import EventResponse from "../eventResponse"

export default class TestAConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestA]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return new EventResponse(event, EventResponseStatus.Satisfied)
  }
}
