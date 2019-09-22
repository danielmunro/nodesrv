import { inject, injectable } from "inversify"
import ClientService from "../../client/service/clientService"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import {Types} from "../../support/types"

@injectable()
export default class MobLeavesRoomEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  constructor(@inject(Types.ClientService) private readonly clientService: ClientService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobLeft]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    this.announceLeaving(event.mob)
    return EventResponse.none(event)
  }

  private announceLeaving(mob: MobEntity) {
    this.clientService.sendMessageInRoom(mob, mob.name + " left.")
  }
}
