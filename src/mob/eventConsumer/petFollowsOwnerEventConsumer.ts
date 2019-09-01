import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import LocationService from "../service/locationService"

@injectable()
export default class PetFollowsOwnerEventConsumer implements EventConsumer {
  constructor(@inject(Types.LocationService) private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    await this.followIfPetOfMob(event.mob, event.source, event.destination)
    return EventResponse.none(event)
  }

  private async followIfPetOfMob(mob: MobEntity, source: RoomEntity, destination: RoomEntity) {
    const sourceMobs = this.locationService.getMobsByRoom(source)
    for (const sourceMob of sourceMobs) {
      if (sourceMob.traits.isPet && mob.pet === sourceMob) {
        await this.locationService.updateMobLocation(sourceMob, destination)
      }
    }
  }
}
