import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import MobMessageEvent from "../../mob/event/mobMessageEvent"
import Maybe from "../../support/functional/maybe/maybe"
import {Types} from "../../support/types"
import ClientService from "../service/clientService"

@injectable()
export default class SendMessageToMobEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

  public async consume(event: MobMessageEvent): Promise<EventResponse> {
    Maybe.if(this.clientService.getClientByMob(event.mob), client => client.sendMessage(event.message))
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.SendMessageToMob ]
  }
}
