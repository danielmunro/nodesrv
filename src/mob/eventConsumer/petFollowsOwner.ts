import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Room} from "../../room/model/room"
import MobMoveEvent from "../event/mobMoveEvent"
import LocationService from "../locationService"
import {Mob} from "../model/mob"
import MobLocation from "../model/mobLocation"

export default class PetFollowsOwner implements EventConsumer {
  constructor(private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    this.followIfPetOfMob(event.mob, event.source)
    return EventResponse.none(event)
  }

  private followIfPetOfMob(mob: Mob, roomLeft: Room) {
    const location = this.locationService.getLocationForMob(mob) as MobLocation
    const sourceMobs = this.locationService.getMobsByRoom(roomLeft)
    sourceMobs.forEach(sourceMob => {
      if (sourceMob.traits.isPet && mob.pet === sourceMob) {
        this.locationService.updateMobLocation(sourceMob, location.room)
      }
    })
  }
}
