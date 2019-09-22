import {inject, injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import ItemService from "../../item/service/itemService"
import DeathEvent from "../../mob/event/deathEvent"
import {Types} from "../../support/types"
import LocationService from "../service/locationService"

@injectable()
export default class AddCorpseToRoomOnDeathEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.ItemService) private readonly itemService: ItemService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const room = this.locationService.getRoomForMob(event.death.mobKilled)
    room.inventory.addItem(event.death.corpse)
    this.itemService.add(event.death.corpse)
    return EventResponse.none(event)
  }
}
