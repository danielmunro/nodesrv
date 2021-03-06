import { inject, injectable } from "inversify"
import Action from "../../action/impl/action"
import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import KafkaService from "../../kafka/kafkaService"
import EventContext from "../../messageExchange/context/eventContext"
import {RequestType} from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Types} from "../../support/types"

@injectable()
export default class LoggedInEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.StartRoom) private readonly startRoom: RoomEntity,
    @inject(Types.LookAction) private readonly lookDefinition: Action,
    @inject(Types.KafkaService) private readonly kafkaService: KafkaService) {
    super()
  }

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
