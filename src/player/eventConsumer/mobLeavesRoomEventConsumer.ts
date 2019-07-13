import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import ClientService from "../../server/service/clientService"

export default class MobLeavesRoomEventConsumer implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

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
