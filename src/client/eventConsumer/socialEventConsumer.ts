import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Types} from "../../support/types"
import {Channel} from "../enum/channel"
import SocialEvent from "../event/socialEvent"
import ClientService from "../service/clientService"

@injectable()
export default class SocialEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {}

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
        this.clientService.sendMessageToMob(event.toMob as MobEntity, event.message)
        break
      case Channel.GlobalUpdate:
        this.clientService.sendMessage(event.mob, event.message)
    }
    return EventResponse.satisfied(event)
  }
}
