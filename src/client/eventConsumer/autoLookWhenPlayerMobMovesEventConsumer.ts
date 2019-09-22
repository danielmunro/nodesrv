import { inject, injectable } from "inversify"
import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventContext from "../../messageExchange/context/eventContext"
import {RequestType} from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import {Types} from "../../support/types"
import {Client} from "../client"
import ClientService from "../service/clientService"

@injectable()
export default class AutoLookWhenPlayerMobMovesEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.LookAction) private readonly lookDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async isEventConsumable(event: MobMoveEvent): Promise<boolean> {
    return !!this.clientService.getClientByMob(event.mob)
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const client = this.clientService.getClientByMob(event.mob) as Client
    const response = await this.lookDefinition.handle(
      new Request(event.mob,
        event.destination,
        { requestType: RequestType.Look } as EventContext))
    client.sendMessage(response.getMessageToRequestCreator())
    return EventResponse.none(event)
  }
}
