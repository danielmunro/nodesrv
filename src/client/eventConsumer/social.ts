import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import ClientService from "../../server/clientService"
import SocialEvent from "../event/socialEvent"
import {Channel} from "../channel"

export default class Social implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.Social]
  }

  public async consume(event: SocialEvent): Promise<EventResponse> {
    switch (event.channel) {
      case Channel.Gossip:
        this.clientService.sendMessage(event.mob, event.message)
        break
      case Channel.Say:
        this.clientService.sendMessageInRoom(event.mob, event.message)
        break
      case Channel.Tell:
        this.clientService.sendMessageToMob(event.toMob, event.message)
        break
    }
    return Promise.resolve(EventResponse.None)
  }
}
