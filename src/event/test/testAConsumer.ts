import Event from "../event"
import EventConsumer from "../eventConsumer"
import {EventResponseStatus} from "../eventResponseStatus"
import {EventType} from "../eventType"

export default class TestAConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.TestA]
  }

  public async consume(event: Event): Promise<EventResponseStatus> {
    return EventResponseStatus.Satisfied
  }
}
