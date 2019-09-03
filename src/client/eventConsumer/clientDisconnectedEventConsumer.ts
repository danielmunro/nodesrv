import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import LocationService from "../../mob/service/locationService"
import {Types} from "../../support/types"
import ClientEvent from "../event/clientEvent"

@injectable()
export default class ClientDisconnectedEventConsumer implements EventConsumer {
  constructor(@inject(Types.LocationService) private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public async consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.removeMob(event.client.getSessionMob())
    return EventResponse.none(event)
  }
}
