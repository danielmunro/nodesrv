import { inject, injectable } from "inversify"
import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import LocationService from "../service/locationService"

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
