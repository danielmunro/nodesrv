import {EventType} from "../enum/eventType"
import Event from "../event"

export default class TestEvent implements Event {
  constructor(public readonly eventType: EventType) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
