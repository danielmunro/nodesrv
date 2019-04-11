import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import ClientService from "../../server/clientService"
import Maybe from "../../support/functional/maybe"

export default class MobUpdatedEventConsumer implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public async consume(event: MobEvent): Promise<EventResponse> {
    new Maybe(this.clientService.getClientByMob(event.mob))
      .do(client => client.sendMessage(event.context))
      .get()
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobUpdated ]
  }
}
