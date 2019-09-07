import { inject, injectable } from "inversify"
import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import ClientService from "../service/clientService"

@injectable()
export default class ClientDisconnectRemoveClientEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.clientService.remove(event.client)
    console.info("client disconnected", { ip: event.client.ip })
    return EventResponse.none(event)
  }
}
