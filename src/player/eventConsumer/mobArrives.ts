import MobEvent from "../../event/event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Mob} from "../../mob/model/mob"
import ClientService from "../../server/clientService"

export default class MobArrives implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobArrived]
  }

  public consume(event: MobEvent): EventResponse {
    this.announceArrival(event.mob)
    return EventResponse.None
  }

  private announceArrival(mob: Mob) {
    this.clientService.sendMessageInRoom(mob, mob.name + " has arrived.")
  }
}
