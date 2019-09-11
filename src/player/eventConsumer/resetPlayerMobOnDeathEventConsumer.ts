import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DeathEvent from "../../mob/event/deathEvent"
import LocationService from "../../mob/service/locationService"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Types} from "../../support/types"

@injectable()
export default class ResetPlayerMobOnDeathEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.StartRoom) private readonly startRoom: RoomEntity) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const mob = event.death.mobKilled
    if (mob.isPlayerMob()) {
      mob.hp = 0
      await this.locationService.updateMobLocation(mob, this.startRoom)
    }

    return EventResponse.none(event)
  }
}
