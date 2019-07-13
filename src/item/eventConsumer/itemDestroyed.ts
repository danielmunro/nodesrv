import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import ItemEvent from "../event/itemEvent"
import ItemService from "../service/itemService"

export default class ItemDestroyed implements EventConsumer {
  constructor(private readonly itemService: ItemService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ItemDestroyed]
  }

  public async consume(event: ItemEvent): Promise<EventResponse> {
    if (event.item.inventory) {
      event.item.inventory.removeItem(event.item)
    }
    this.itemService.remove(event.item)
    return EventResponse.none(event)
  }
}
