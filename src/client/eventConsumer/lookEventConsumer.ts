import { inject, injectable } from "inversify"
import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventContext from "../../messageExchange/context/eventContext"
import {RequestType} from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import ClientService from "../../server/service/clientService"
import {Types} from "../../support/types"

@injectable()
export default class LookEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.LookAction) private readonly lookDefinition: Action) {}

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
