import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import ResponseMessage from "../../request/responseMessage"
import {Disposition} from "../enum/disposition"
import TickEvent from "../event/tickEvent"
import {Messages} from "./constants"

export default class DeathTimerEventConsumer implements EventConsumer {
  constructor(private readonly eventService: EventService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async consume(event: TickEvent): Promise<EventResponse> {
    const mob = event.mob
    if (mob.deathTimer) {
      mob.deathTimer--
      if (mob.deathTimer === 0) {
        mob.disposition = Disposition.Dead
        await this.eventService.publish(createRoomMessageEvent(
          event.room,
          new ResponseMessage(
            event.mob,
            Messages.Mob.Decay,
            { mob },
            { mob })))
      }
    }
    return EventResponse.none(event)
  }
}
