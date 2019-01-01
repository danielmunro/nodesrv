import ClientEvent from "../../client/event/clientEvent"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import LocationService from "../locationService"

export default class ClientDisconnected implements EventConsumer {
  constructor(private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.removeMob(event.client.getSessionMob())
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
