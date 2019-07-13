import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DeathEvent from "../../mob/event/deathEvent"
import LocationService from "../../mob/service/locationService"
import {RoomEntity} from "../../room/entity/roomEntity"

export default class ResetPlayerMobOnDeathEventConsumer implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly startRoom: RoomEntity) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const mob = event.death.mobKilled
    if (mob.playerMob) {
      mob.hp = 0
      await this.locationService.updateMobLocation(mob, this.startRoom)
    }

    return EventResponse.none(event)
  }
}
