import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {RoomEntity} from "../../room/entity/roomEntity"
import {newMobLocation} from "../factory/mobFactory"
import LocationService from "../service/locationService"

export default class ClientCreatedEventConsumer implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly startRoom: RoomEntity) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientLogin]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.addMobLocation(newMobLocation(event.client.getSessionMob(), this.startRoom))
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
