import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import ItemEvent from "../event/itemEvent"
import ItemService from "../service/itemService"

@injectable()
export default class ItemCreatedEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.ItemService) private readonly itemService: ItemService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ItemCreated ]
  }

  public async consume(event: ItemEvent): Promise<EventResponse> {
    this.itemService.add(event.item, event.carriedBy)
    return EventResponse.none(event)
  }
}
