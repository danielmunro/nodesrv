import { inject, injectable } from "inversify"
import ClientEvent from "../../client/event/clientEvent"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import ClientService from "../service/clientService"

@injectable()
// tslint:disable-next-line:max-line-length
export default class ClientDisconnectRemoveClientEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.clientService.remove(event.client)
    console.info("client disconnected", { ip: event.client.ip })
    return EventResponse.none(event)
  }
}
