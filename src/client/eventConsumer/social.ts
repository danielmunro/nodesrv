import MobEvent from "../../event/event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import ClientService from "../../server/clientService"

export default class Social implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.Social]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    this.clientService.sendMessage(event.mob, event.context)
    return Promise.resolve(EventResponse.None)
  }
}
