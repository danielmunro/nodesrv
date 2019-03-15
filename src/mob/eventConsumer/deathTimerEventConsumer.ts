import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import ResponseMessage from "../../request/responseMessage"
import RoomMessageEvent from "../../room/event/roomMessageEvent"
import {Disposition} from "../enum/disposition"
import MobEvent from "../event/mobEvent"
import LocationService from "../locationService"
import MobLocation from "../model/mobLocation"
import {Messages} from "./constants"

export default class DeathTimerEventConsumer implements EventConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const mob = event.mob
    if (mob.deathTimer) {
      mob.deathTimer--
      if (mob.deathTimer === 0) {
        mob.disposition = Disposition.Dead
        const location = this.locationService.getLocationForMob(mob) as MobLocation
        await this.eventService.publish(new RoomMessageEvent(
          location.room,
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
