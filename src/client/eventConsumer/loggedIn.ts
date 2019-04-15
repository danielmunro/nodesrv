import Action from "../../action/action"
import ClientEvent from "../../client/event/clientEvent"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import {newMobLocation} from "../../mob/factory"
import LocationService from "../../mob/locationService"
import EventContext from "../../request/context/eventContext"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"
import {Room} from "../../room/model/room"

export default class LoggedIn implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly startRoom: Room,
    private readonly lookDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientLogin]
  }

  public async consume(event: ClientEvent): Promise<EventResponse> {
    this.locationService.addMobLocation(newMobLocation(event.client.getSessionMob(), this.startRoom))
    const response = await this.lookDefinition.handle(
      new Request(event.client.getSessionMob(),
        this.startRoom,
        new EventContext(RequestType.Look)))
    event.client.sendMessage(response.message.getMessageToRequestCreator())
    return new EventResponse(event, EventResponseStatus.None, response)
  }
}
