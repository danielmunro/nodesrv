import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import MobMoveEvent from "../event/mobMoveEvent"
import FightBuilder from "../fight/fightBuilder"
import LocationService from "../service/locationService"
import MobService from "../service/mobService"

@injectable()
export default class AggressiveMobEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.FightBuilder) private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async isEventConsumable(event: MobMoveEvent): Promise<boolean> {
    return event.mob.isPlayerMob()
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const mob = event.mob
    const location = this.locationService.getLocationForMob(mob)
    const mobs = this.locationService.getMobsByRoom(location.room).filter(m => m !== mob)
    mobs.forEach(m => {
      if (m.traits.aggressive && m.level >= mob.level) {
        this.mobService.addFight(this.fightBuilder.create(m, mob))
      }
    })
    return EventResponse.none(event)
  }
}
