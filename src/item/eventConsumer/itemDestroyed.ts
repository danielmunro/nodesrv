import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import ItemEvent from "../event/itemEvent"
import ItemService from "../itemService"

export default class ItemDestroyed implements EventConsumer {
  constructor(
    private readonly itemService: ItemService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ItemDestroyed]
  }

  public async consume(event: ItemEvent): Promise<EventResponse> {
    this.itemService.remove(event.item)
    return EventResponse.none(event)
  }
}
