import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Room} from "../../room/model/room"
import MobMoveEvent from "../event/mobMoveEvent"
import {Mob} from "../model/mob"
import LocationService from "../service/locationService"

export default class PetFollowsOwner implements EventConsumer {
  constructor(private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    await this.followIfPetOfMob(event.mob, event.source, event.destination)
    return EventResponse.none(event)
  }

  private async followIfPetOfMob(mob: Mob, source: Room, destination: Room) {
    const sourceMobs = this.locationService.getMobsByRoom(source)
    for (const sourceMob of sourceMobs) {
      if (sourceMob.traits.isPet && mob.pet === sourceMob) {
        await this.locationService.updateMobLocation(sourceMob, destination)
      }
    }
  }
}
