import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import {Mob} from "../../mob/model/mob"
import ClientService from "../../server/clientService"

export default class MobLeaves implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    this.announceLeaving(event.mob)
    return EventResponse.none(event)
  }

  private announceLeaving(mob: Mob) {
    this.clientService.sendMessageInRoom(mob, mob.name + " left.")
  }
}
