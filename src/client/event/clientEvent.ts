import {EventType} from "../../event/enum/eventType"
import Event from "../../event/event"
import {Client} from "../client"

export default class ClientEvent implements Event {
  constructor(
    private readonly eventType: EventType,
    public readonly client: Client) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
