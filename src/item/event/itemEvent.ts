import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Item} from "../model/item"

export default class ItemEvent implements Event {
  constructor(
    private readonly eventType: EventType,
    public readonly item: Item,
    public readonly carriedBy: any) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
