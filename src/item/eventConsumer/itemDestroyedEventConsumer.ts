import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import ItemEvent from "../event/itemEvent"
import ItemService from "../service/itemService"

@injectable()
export default class ItemDestroyedEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(@inject(Types.ItemService) private readonly itemService: ItemService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ItemDestroyed ]
  }

  public async consume(event: ItemEvent): Promise<EventResponse> {
    if (event.item.inventory) {
      event.item.inventory.removeItem(event.item)
    }
    this.itemService.remove(event.item)
    return EventResponse.none(event)
  }
}
