import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import EveryMessageEventConsumer from "../eventConsumer/everyMessageEventConsumer"
import Event from "../interface/event"
import EventConsumer from "../interface/eventConsumer"
import EventResponse from "../messageExchange/eventResponse"

export default class TestAConsumer extends EveryMessageEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.TestA ]
  }

  public async consume(event: Event): Promise<EventResponse> {
    return new EventResponse(event, EventResponseStatus.Satisfied)
  }
}
