import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import LocationService from "../service/locationService"

export default class ClientDisconnectedEventConsumer implements EventConsumer {
  constructor(private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public async consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.removeMob(event.client.getSessionMob())
    return EventResponse.none(event)
  }
}
