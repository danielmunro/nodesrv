import Action from "../../action/action"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import EventContext from "../../request/context/eventContext"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import ClientService from "../../server/clientService"

export default class LookEventConsumer implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly lookDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const response = await this.lookDefinition.handle(
      new Request(event.mob,
        event.destination,
        new EventContext(RequestType.Look)))
    const client = this.clientService.getClientByMob(event.mob)
    if (client) {
      client.sendMessage(response.getMessageToRequestCreator())
    }
    return new EventResponse(event, EventResponseStatus.None, response)
  }
}
