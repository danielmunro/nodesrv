import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import ResponseMessage from "../../messageExchange/responseMessage"
import {Types} from "../../support/types"
import {Disposition} from "../enum/disposition"
import TickEvent from "../event/tickEvent"
import {Messages} from "./constants"

@injectable()
export default class DeathTimerEventConsumer implements EventConsumer {
  constructor(@inject(Types.EventService) private readonly eventService: EventService) {}

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
