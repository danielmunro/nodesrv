import ClientEvent from "../../client/event/clientEvent"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import ClientService from "../../server/clientService"

export default class Disconnected implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientDisconnected]
  }

  public consume(event: ClientEvent): Promise<EventResponse> {
    this.clientService.remove(event.client)
    console.info("client disconnected", { ip: event.client.ip })
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
