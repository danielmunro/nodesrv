import MobEvent from "../../event/event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Mob} from "../../mob/model/mob"
import ClientService from "../../server/clientService"

export default class MobLeaves implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobLeft]
  }

  public consume(event: MobEvent): EventResponse {
    this.announceLeaving(event.mob)
    return EventResponse.None
  }

  private announceLeaving(mob: Mob) {
    this.clientService.sendMessageInRoom(mob, mob.name + " left.")
  }
}
