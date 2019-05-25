import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import ClientService from "../../server/service/clientService"

export default class LookEventConsumer implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly lookDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const client = this.clientService.getClientByMob(event.mob)
    if (client) {
      const response = await this.lookDefinition.handle(
        new Request(event.mob,
          event.destination,
          { requestType: RequestType.Look } as EventContext))
      client.sendMessage(response.getMessageToRequestCreator())
    }
    return EventResponse.none(event)
  }
}
