import Action from "../../action/impl/action"
import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import KafkaService from "../../kafka/kafkaService"
import {newMobLocation} from "../../mob/factory/mobFactory"
import LocationService from "../../mob/service/locationService"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {RoomEntity} from "../../room/entity/roomEntity"

export default class LoggedIn implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly startRoom: RoomEntity,
    private readonly lookDefinition: Action,
    private readonly kafkaService: KafkaService) {}

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
    event.client.player.lastLogin = new Date()
    await this.kafkaService.publishPlayer(event.client.player)
    return new EventResponse(event, EventResponseStatus.None, response)
  }
}
