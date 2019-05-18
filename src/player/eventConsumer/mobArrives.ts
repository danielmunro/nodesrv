import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import MobEvent from "../../mob/event/mobEvent"
import {Mob} from "../../mob/model/mob"
import ClientService from "../../server/clientService"

export default class MobArrives implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    this.announceArrival(event.mob)
    return EventResponse.none(event)
  }

  private announceArrival(mob: Mob) {
    this.clientService.sendMessageInRoom(mob, mob.name + " has arrived.")
  }
}
