import EventConsumer from "../../event/eventConsumer"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import {Mob} from "../../mob/model/mob"
import ClientService from "../../server/clientService"

export default class MobLeaves implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobLeft]
  }

  public async consume(event: MobEvent): Promise<EventResponseStatus> {
    this.announceLeaving(event.mob)
    return EventResponseStatus.None
  }

  private announceLeaving(mob: Mob) {
    this.clientService.sendMessageInRoom(mob, mob.name + " left.")
  }
}
