import Action from "../../action/impl/action"
import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {newMobLocation} from "../../mob/factory"
import LocationService from "../../mob/service/locationService"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
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
        { requestType: RequestType.Look } as EventContext))
    event.client.sendMessage(response.message.getMessageToRequestCreator())
    return new EventResponse(event, EventResponseStatus.None, response)
  }
}
