import ClientEvent from "../../client/event/clientEvent"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import {Room} from "../../room/model/room"
import {newMobLocation} from "../factory"
import LocationService from "../locationService"

export default class ClientCreated implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly startRoom: Room) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientLogin]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.addMobLocation(newMobLocation(event.client.getSessionMob(), this.startRoom))
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
