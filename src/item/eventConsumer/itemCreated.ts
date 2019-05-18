import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import ItemEvent from "../event/itemEvent"
import ItemService from "../itemService"

export default class ItemCreated implements EventConsumer {
  constructor(
    private readonly itemService: ItemService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ItemCreated]
  }

  public async consume(event: ItemEvent): Promise<EventResponse> {
    this.itemService.add(event.item, event.carriedBy)
    return EventResponse.none(event)
  }
}
