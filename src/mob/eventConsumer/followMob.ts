import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import ItemService from "../../item/itemService"
import ClientService from "../../server/clientService"
import MobEvent from "../event/mobEvent"
import LocationService from "../locationService"

export default class FollowMob implements EventConsumer {
  // constructor(
  //   private readonly clientService: ClientService,
  //   private readonly itemService: ItemService,
  //   private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {

    return EventResponse.none(event)
  }
}
