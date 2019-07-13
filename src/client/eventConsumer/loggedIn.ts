import Action from "../../action/impl/action"
import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import KafkaService from "../../kafka/kafkaService"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {RoomEntity} from "../../room/entity/roomEntity"

export default class LoggedIn implements EventConsumer {
  constructor(
    private readonly startRoom: RoomEntity,
    private readonly lookDefinition: Action,
    private readonly kafkaService: KafkaService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientLogin]
  }

  public async consume(event: ClientEvent): Promise<EventResponse> {
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
