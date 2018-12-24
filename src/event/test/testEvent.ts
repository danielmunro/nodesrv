import Event from "../event"
import {EventType} from "../eventType"

export default class TestEvent implements Event {
  constructor(public readonly eventType: EventType) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
