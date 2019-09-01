import { inject, injectable } from "inversify"
import ClientEvent from "../../client/event/clientEvent"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import ClientService from "../../server/service/clientService"
import {Types} from "../../support/types"

@injectable()
export default class DisconnectedEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.clientService.remove(event.client)
    console.info("client disconnected", { ip: event.client.ip })
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}