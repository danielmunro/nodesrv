import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import ClientService from "../../server/service/clientService"
import Maybe from "../../support/functional/maybe/maybe"
import {Types} from "../../support/types"
import MobMessageEvent from "../event/mobMessageEvent"

@injectable()
export default class MobUpdatedEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

  public async consume(event: MobMessageEvent): Promise<EventResponse> {
    new Maybe(this.clientService.getClientByMob(event.mob))
      .do(client => client.sendMessage(event.message))
      .get()
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobUpdated ]
  }
}
